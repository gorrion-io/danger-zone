import { buildSchema, prop as Property } from '@typegoose/typegoose';
import { ObjectId } from 'bson';
import { Schema } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';
import { Roles } from './user-roles.enum';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';

@ObjectType()
export class User {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  userName: string;

  @Field(type => Roles)
  @Property({ required: true })
  userRole: Roles;

  @Field({ nullable: true })
  @Property()
  email?: string;

  @Field({ nullable: true })
  @Property()
  password?: string;
}

export const UserSchema: Schema<typeof User> = buildSchema(User);
