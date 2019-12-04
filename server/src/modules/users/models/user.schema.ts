import { buildSchema, prop as Property } from '@typegoose/typegoose';
import { ObjectId } from 'bson';
import { Schema } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';
import { Role } from './user-roles.enum';
import { ResolveLoader } from 'webpack';

@ObjectType()
export class User {
  @Field(() => ObjectIdScalar)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  userName: string;

  @Field({ nullable: true })
  @Property()
  email?: string;

  @Field({ nullable: true })
  @Property()
  password?: string;

  @Field(type => Role)
  @Property({
    required: true,
    default: Role.USER,
  })
  role: Role;
}

export const UserSchema: Schema<typeof User> = buildSchema(User);
