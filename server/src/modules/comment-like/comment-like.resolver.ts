import { Inject, UseGuards } from '@nestjs/common';
import {
  Mutation,
  Args,
  Resolver,
  Context,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { CommentLike } from './models/comment-like.schema';
import { CommentLikeService } from './comment-like.service';
import { UpdateCommentLikeInput } from './models/update-comment-like.input';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { SuccessResponse } from '../common/graphql-generic-responses/success-response.model';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';
import { GenericResponseUnion } from '../common/unions/generic-response.union';
import { AuthGuard } from '../auth/guards/user-auth.guard';
import { LikeType } from './models/like-type.enum';

@Resolver()
@UseGuards(AuthGuard)
export class CommentLikeResolver {
  constructor(
    @Inject(CommentLikeService)
    private readonly commentLikeService: CommentLikeService,
  ) {}

  @Mutation(() => GenericResponseUnion)
  async updateCommentLike(
    @Args('commentLike') commentLike: UpdateCommentLikeInput,
    @Context('user') user: ICurrentUser,
  ): Promise<SuccessResponse | ErrorResponse> {
    return this.commentLikeService.updateCommentLike(commentLike, user);
  }
}
