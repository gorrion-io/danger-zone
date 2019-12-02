import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TokenModel {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
