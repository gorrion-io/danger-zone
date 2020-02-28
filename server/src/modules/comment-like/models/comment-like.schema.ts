import {
  buildSchema,
  pre as Pre,
  prop as Property,
  Ref,
} from '@typegoose/typegoose';
import { ObjectId } from 'bson';
import { Schema } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';
import { User } from '../../users/models/user.schema';
import { LikeType } from './like-type.enum';
import { ReportComment } from '../../report-comments/models/report-comment.schema';

@Pre<CommentLike>('save', function() {
  this.lastEditDate = new Date();
})
@ObjectType()
export class CommentLike {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field(type => User)
  @Property({ ref: User })
  addedBy: Ref<User>;

  @Field()
  @Property({ required: false })
  lastEditDate?: Date;

  @Field(() => ObjectIdScalar)
  @Property({ required: true, ref: ReportComment })
  commentId: ObjectId;

  @Field(() => LikeType)
  @Property({ enum: LikeType, required: true })
  likeType: LikeType;
}

export const CommentLikeSchema: Schema<typeof CommentLike> = buildSchema(
  CommentLike,
);
