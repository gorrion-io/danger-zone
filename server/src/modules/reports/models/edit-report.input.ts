import { ObjectId } from 'bson';
import { Field, InputType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';

@InputType()
export class EditReportInput {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ObjectIdScalar)
  reportedBy: ObjectId; // remove it later
}
