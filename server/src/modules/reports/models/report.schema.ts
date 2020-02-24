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

@Pre<Report>('save', function() {
  this.lastEditDate = new Date();
})
@Pre<Report>(['find', 'findOne'], function() {
  this.where({ isDeleted: false });
})
@ObjectType()
export class Report {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  creationDate: Date;

  @Field()
  @Property({ required: true })
  lastEditDate: Date;

  @Field()
  @Property({ required: true, maxlength: 50 })
  title: string;

  @Field()
  @Property({ required: true, maxlength: 250 })
  description: string;

  @Field(type => User)
  @Property({ ref: User })
  reportedBy: Ref<User>;

  @Field()
  @Property({ required: true, default: false })
  isDeleted: boolean;

  @Field()
  @Property({ required: true })
  latitude: number;

  @Field()
  @Property({ required: true })
  longitude: number;
}

export const ReportSchema: Schema<typeof Report> = buildSchema(Report);
