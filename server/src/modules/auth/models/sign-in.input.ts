import { Field, InputType } from 'type-graphql';
import { GrantType } from './grant-type.enum';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';
import { ObjectId } from 'bson';
@InputType()
export class SignInInput {
  @Field(type => GrantType)
  grantType: GrantType;

  @Field(type => ObjectIdScalar, { nullable: true })
  userId?: ObjectId;

  @Field({ nullable: true })
  refreshToken?: string;
}
