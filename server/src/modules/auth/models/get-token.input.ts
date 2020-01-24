import { Field, InputType } from 'type-graphql';
import { GrantType } from './grant-type.enum';

@InputType()
export class GetTokenInput {
  @Field(type => GrantType)
  grantType: GrantType;

  @Field({ nullable: true })
  userName?: string;

  @Field({ nullable: true })
  refreshToken?: string;
}
