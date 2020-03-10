import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Args, Resolver, Context } from '@nestjs/graphql';
import { CommentLikeService } from './comment-like.service';
import { UpdateCommentLikeInput } from './models/update-comment-like.input';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';
import { AuthGuard } from '../auth/guards/user-auth.guard';
import { ReportComment } from '../report-comments/models/report-comment.schema';
import { ReportCommentUnion } from '../report-comments/unions/report-comment.union';

@Resolver()
@UseGuards(AuthGuard)
export class CommentLikeResolver {
  constructor(
    @Inject(CommentLikeService)
    private readonly commentLikeService: CommentLikeService,
  ) {}

  @Mutation(() => ReportCommentUnion)
  async updateCommentLike(
    @Args('commentLike') commentLike: UpdateCommentLikeInput,
    @Context('user') user: ICurrentUser,
  ): Promise<ReportComment | ErrorResponse> {
    return this.commentLikeService.updateCommentLike(commentLike, user);
  }
}
