import { Field, InputType } from 'type-graphql';
import { GrantType } from './grant-type.enum';
import { ObjectId } from 'bson';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';

@InputType()
export class GetTokenInput {
  @Field(() => GrantType)
  grantType: GrantType;

  @Field(() => ObjectIdScalar, { nullable: true })
  userId?: ObjectId;

  @Field({ nullable: true })
  refreshToken?: string;
}
