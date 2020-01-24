import { Field, InputType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';
import { ObjectId } from 'bson';

@InputType()
export class RegisterUserInput {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field()
  email: string;

  @Field()
  password: string;
}
