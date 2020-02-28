import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Parent,
  ResolveProperty,
} from '@nestjs/graphql';
import { AuthGuard } from '../auth/guards/user-auth.guard';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
import { AddReportCommentInput } from './models/add-report-comment.input';
import { EditReportCommentInput } from './models/edit-report-comment.input';
import { ReportComment } from './models/report-comment.schema';
import { ReportCommentsService } from './report-comments.service';
import { User } from '../users/models/user.schema';
import { UsersService } from '../users/users.service';
import { ObjectId } from 'bson';
import { LikeType } from '../comment-like/models/like-type.enum';
import { CommentLikeService } from '../comment-like/comment-like.service';

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

  @Query(() => [ReportComment])
  async findAllComments(
    @Args('id') reportId: ObjectIdScalar,
  ): Promise<ReportComment[]> {
    return this.reportCommentsService.findAll(reportId);
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
    return this.reportCommentsService.add(reportInput, user);
  }

  @Mutation(() => ReportComment)
  async editReport(
    @Args('comment') reportInput: EditReportCommentInput,
  ): Promise<ReportComment> {
    return this.reportCommentsService.edit(reportInput);
  }
}
