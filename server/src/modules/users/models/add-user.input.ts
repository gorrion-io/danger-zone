import { ROLE } from './../../../constants/enums';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AddUserInput {
  @Field()
  userName: string;

  @Field()
  role: ROLE = ROLE.User;
}
