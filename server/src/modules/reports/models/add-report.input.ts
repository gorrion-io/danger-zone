import { ObjectId } from 'bson';
import { Field, InputType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';

@InputType()
export class AddReportInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => ObjectIdScalar)
  reportedBy: ObjectId; // remove it later
}
