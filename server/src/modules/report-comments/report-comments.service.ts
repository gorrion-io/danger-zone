import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
import { AddReportCommentInput } from './models/add-report-comment.input';
import { EditReportCommentInput } from './models/edit-report-comment.input';
import { ReportComment } from './models/report-comment.schema';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';
import { ObjectId } from 'bson';
import { FindAllCommentsInput } from './models/find-all-comments.input';
@Injectable()
export class ReportCommentsService {
  constructor(
    @InjectModel(ReportComment.name)
    private readonly commentModel: ReturnModelType<typeof ReportComment>,
  ) {}

  async findAll(request: FindAllCommentsInput): Promise<ReportComment[]> {
    return this.commentModel
      .find({ reportId: request.reportId, answeredTo: request.answeredTo })
      .exec();
  }

  async findOne(id: ObjectIdScalar | ObjectId): Promise<ReportComment> {
    return this.commentModel.findById(id);
  }

  async add(
    dto: AddReportCommentInput,
    user: ICurrentUser,
  ): Promise<ReportComment> {
    const comment = new this.commentModel();
    Object.assign(comment, dto);
    comment.creationDate = new Date();
    comment.addedBy = user._id;
    comment.likes = 0;
    comment.dislikes = 0;

    return comment.save();
  }

  async edit(dto: EditReportCommentInput): Promise<ReportComment> {
    const comment = await this.commentModel.findById(dto._id);
    if (!comment) {
      throw new Error(`Comment with id: "${dto._id}" not found.`);
    }
    Object.assign(comment, dto);

    return comment.save();
  }

  async delete(id: ObjectIdScalar): Promise<ObjectIdScalar> {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new Error(`Comment with id: "${id}" not found.`);
    }

    comment.isDeleted = true;
    comment.save();

    return comment.id;
  }

  async updateCommentLikes(
    commentId: ObjectId,
    likes: number,
    dislikes: number,
  ): Promise<ReportComment | ErrorResponse> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) {
      return new ErrorResponse(`Comment with id: "${commentId}" not found.`);
    }

    comment.likes = likes;
    comment.dislikes = dislikes;

    const c = await comment.save();
    return Object.setPrototypeOf(c.toObject(), new ReportComment());
  }

  async getCommentAnswersCount(commentId: ObjectId) {
    return this.commentModel.find({ answeredTo: commentId }).count();
  }
}
