import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SuccessResponse {
  @Field()
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
