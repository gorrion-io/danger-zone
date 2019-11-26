import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TokenModel {
  @Field()
  token: string;
}
