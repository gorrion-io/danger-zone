import { Field, InputType } from 'type-graphql';

@InputType()
export class MagicLinkInput {
  @Field()
  email: string;
}
