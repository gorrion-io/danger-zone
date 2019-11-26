import { ObjectId } from 'bson';
import { Field, InputType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';

@InputType()
export class EditUserInput {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field({ nullable: true })
  userName?: string;

  @Field({ nullable: true })
  email?: string;
}
