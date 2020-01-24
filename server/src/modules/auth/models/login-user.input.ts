import { Field, InputType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';
import { ObjectId } from 'bson';

@InputType()
export class LoginUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
