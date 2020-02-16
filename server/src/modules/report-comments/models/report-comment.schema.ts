import {
  buildSchema,
  pre as Pre,
  prop as Property,
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

  @Field()
  @Property({ required: true })
  lastEditDate: Date;

  @Field()
  @Property({ required: true, maxlength: 500 })
  message: string;

  @Field(() => ObjectIdScalar)
  @Property({ required: true, ref: User })
  addedBy: ObjectId;

  @Field(() => ObjectIdScalar)
  @Property({ required: true, ref: Report })
  reportId: ObjectId;

  @Field(() => ObjectIdScalar, { nullable: true })
  @Property({ ref: ReportComment })
  answeredTo?: ObjectId;

  @Field()
  @Property({ required: true, default: false })
  isDeleted: boolean;
}

export const ReportCommentSchema: Schema<typeof ReportComment> = buildSchema(
  ReportComment,
);
