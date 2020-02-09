import { Field, InputType } from 'type-graphql';
import { Role } from './user-role.enum';

@InputType()
export class AddUserInput {
  @Field()
  userName: string;

  @Field(type => Role, { nullable: true })
  role?: Role;
}
