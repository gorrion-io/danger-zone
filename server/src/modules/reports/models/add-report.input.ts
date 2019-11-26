import { Field, InputType } from 'type-graphql';

@InputType()
export class AddReportInput {
  @Field()
  title: string;

  @Field()
  description: string;
}
