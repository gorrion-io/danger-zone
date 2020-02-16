import { ObjectId } from 'bson';
import { Field, InputType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';

@InputType()
export class EditReportCommentInput {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field()
  message: string;
}
