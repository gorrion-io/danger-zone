import { Field, InputType } from 'type-graphql';
import { GrantType } from './grant-type.enum';

@InputType()
export class SignInInput {
  @Field(type => GrantType)
  grantType: GrantType;

  @Field({ nullable: true })
  userName?: string; // Maybe userId instead?

  @Field({ nullable: true })
  refreshToken?: string;
}
