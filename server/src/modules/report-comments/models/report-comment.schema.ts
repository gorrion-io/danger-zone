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
import { Report } from '../../reports/models/report.schema';
import { User } from '../../users/models/user.schema';

@Pre<ReportComment>('save', function() {
  this.lastEditDate = new Date();
})
@Pre<ReportComment>(['find', 'findOne'], function() {
  this.where({ isDeleted: false });
})
@ObjectType()
export class ReportComment {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  creationDate: Date;

  @Field({ nullable: true })
  @Property({ required: false })
  lastEditDate?: Date;

  @Field()
  @Property({ required: true, maxlength: 500 })
  message: string;

  @Field(type => User)
  @Property({ ref: User })
  addedBy: Ref<User>;

  @Field(() => ObjectIdScalar)
  @Property({ required: true, ref: Report })
  reportId: ObjectId;

  @Field(() => ObjectIdScalar, { nullable: true })
  @Property({ ref: ReportComment })
  answeredTo?: ObjectId;

  @Field()
  @Property({ required: true, default: false })
  isDeleted: boolean;

  @Field()
  @Property({ required: true })
  likes: number;

  @Field()
  @Property({ required: true })
  dislikes: number;
}

export const ReportCommentSchema: Schema<typeof ReportComment> = buildSchema(
  ReportComment,
);
