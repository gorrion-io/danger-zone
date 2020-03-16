import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CommentLike } from './models/comment-like.schema';
import { UpdateCommentLikeInput } from './models/update-comment-like.input';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
import { ReportCommentsService } from '../report-comments/report-comments.service';
import { SuccessResponse } from '../common/graphql-generic-responses/success-response.model';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';
import { ObjectId } from 'bson';
import { LikeType } from './models/like-type.enum';
import { ReportComment } from '../report-comments/models/report-comment.schema';

@Injectable()
export class CommentLikeService {
  constructor(
    @InjectModel(CommentLike.name)
    private readonly commentLike: ReturnModelType<typeof CommentLike>,
    @Inject(ReportCommentsService)
    private readonly reportCommentsService: ReportCommentsService,
  ) {}

  async updateCommentLike(
    dto: UpdateCommentLikeInput,
    user: ICurrentUser,
  ): Promise<ReportComment | ErrorResponse> {
    let commentLike = await this.commentLike.findOne({
      commentId: dto.commentId,
      addedBy: user._id,
    });

    if (!commentLike) {
      commentLike = new this.commentLike();
      commentLike.addedBy = user._id;
    }

    Object.assign(commentLike, dto);
    await commentLike.save();

    const commentLikes = await this.commentLike.find({
      commentId: dto.commentId,
    });
    const likes = commentLikes.filter(cl => cl.likeType === LikeType.Like)
      .length;
    const dislikes = commentLikes.filter(cl => cl.likeType === LikeType.Dislike)
      .length;

    return this.reportCommentsService.updateCommentLikes(
      commentLike.commentId,
      likes,
      dislikes,
    );
  }

  async getUserLikeType(
    commentId: ObjectId,
    userId: ObjectId,
  ): Promise<LikeType> {
    const commentLike = await this.commentLike.findOne({
      commentId,
      addedBy: userId,
    });

    if (!commentLike) {
      return LikeType.None;
    }

    return commentLike.likeType;
  }
}
