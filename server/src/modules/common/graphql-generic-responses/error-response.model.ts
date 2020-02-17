import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ErrorResponse {
  @Field()
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
