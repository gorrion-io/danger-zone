import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ObjectId } from 'bson';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
import { AddUserInput } from './models/add-user.input';
import { EditUserInput } from './models/edit-user.input';
import { User } from './models/user.schema';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @Query(() => [User])
  async findAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Mutation(() => User)
  async addUser(@Args('user') userInput: AddUserInput): Promise<User> {
    return this.usersService.add(userInput);
  }

  @Mutation(() => User)
  async editUser(@Args('user') userInput: EditUserInput): Promise<User> {
    return this.usersService.edit(userInput);
  }

  @Mutation(() => ObjectIdScalar)
  async deleteUser(
    @Args({ name: 'userId', type: () => ObjectIdScalar }) userId: ObjectId,
  ): Promise<ObjectId> {
    return this.usersService.delete(userId);
  }
}
