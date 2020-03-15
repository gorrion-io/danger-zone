import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Parent,
  ResolveProperty,
  Subscription,
} from '@nestjs/graphql';
import { ObjectId } from 'bson';
import { PubSub } from 'apollo-server-express';
import { AuthGuard } from '../auth/guards/user-auth.guard';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
import { AddReportCommentInput } from './models/add-report-comment.input';
import { EditReportCommentInput } from './models/edit-report-comment.input';
import { ReportComment } from './models/report-comment.schema';
import { ReportCommentsService } from './report-comments.service';
import { User } from '../users/models/user.schema';
import { UsersService } from '../users/users.service';
import { LikeType } from '../comment-like/models/like-type.enum';
import { CommentLikeService } from '../comment-like/comment-like.service';
import { FindAllCommentsInput } from './models/find-all-comments.input';
import { CommentSubInput } from './models/comment-sub.input';

const commentSubFilter = (payloadComment, variables) => {
  const pReportId: ObjectId = payloadComment.reportId;
  const vReportId: ObjectId = variables.ids.reportId;
  const pAnsweredeTo: ObjectId = payloadComment.answeredTo;
  const vAnsweredeTo: ObjectId = variables.ids.answeredTo;

  return (
    pReportId.equals(vReportId),
    pAnsweredeTo === vAnsweredeTo || pAnsweredeTo.equals(vAnsweredeTo)
  );
};

@UseGuards(AuthGuard)
@Resolver(() => ReportComment)
export class ReportCommentsResolver {
  constructor(
    @Inject(ReportCommentsService)
    private readonly reportCommentsService: ReportCommentsService,
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(CommentLikeService)
    private readonly commentLikeService: CommentLikeService,
    @Inject('PUB_SUB')
    private readonly pubSub: PubSub,
  ) {}

  @ResolveProperty(type => User)
  async addedBy(@Parent() comment: ReportComment): Promise<User> {
    return this.usersService.findById(comment.addedBy as ObjectId);
  }

  @ResolveProperty(() => LikeType)
  async currentUserLikeType(
    @Parent() comment: ReportComment,
    @Context('user') user: ICurrentUser,
  ): Promise<LikeType> {
    return this.commentLikeService.getUserLikeType(comment._id, user._id);
  }

  @ResolveProperty(() => Number)
  async answersCount(@Parent() comment: ReportComment): Promise<number> {
    return this.reportCommentsService.getCommentAnswersCount(comment._id);
  }

  @Query(() => [ReportComment])
  async findAllComments(
    @Args('findAllComments') req: FindAllCommentsInput,
  ): Promise<ReportComment[]> {
    return this.reportCommentsService.findAll(req);
  }

  @Query(() => ReportComment)
  async findComment(@Args('id') id: ObjectIdScalar): Promise<ReportComment> {
    return this.reportCommentsService.findOne(id);
  }

  @Mutation(() => ReportComment)
  @UseGuards(AuthGuard)
  async addReportComment(
    @Args('comment') reportInput: AddReportCommentInput,
    @Context('user') user: ICurrentUser,
  ): Promise<ReportComment> {
    const comment = await this.reportCommentsService.add(reportInput, user);
    this.pubSub.publish('commentAdded', { commentAdded: comment });

    if (comment.answeredTo) {
      const answeredComment = await this.reportCommentsService.findOne(
        comment.answeredTo,
      );
      this.pubSub.publish('commentUpdate', { commentUpdate: answeredComment });
    }

    return comment;
  }

  @Mutation(() => ReportComment)
  async editReport(
    @Args('comment') reportInput: EditReportCommentInput,
  ): Promise<ReportComment> {
    return this.reportCommentsService.edit(reportInput);
  }

  @Subscription(() => ReportComment, {
    filter: (payload, variables) =>
      commentSubFilter(payload.commentAdded, variables),
  })
  commentAdded(@Args('ids') ids: CommentSubInput) {
    return this.pubSub.asyncIterator('commentAdded');
  }

  @Subscription(() => ReportComment, {
    filter: (payload, variables) =>
      commentSubFilter(payload.commentUpdate, variables),
  })
  commentUpdate(@Args('ids') ids: CommentSubInput) {
    return this.pubSub.asyncIterator('commentUpdate');
  }
}
