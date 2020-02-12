import { buildSchema, prop as Property } from '@typegoose/typegoose';
import { ObjectId } from 'bson';
import { Schema } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';

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

  @Property()
  magicLinkId?: string;

  @Property()
  magicLinkCreatedAt?: Date;

  @Property()
  activationLinkId?: string;

  @Property()
  isActivated?: boolean;
}
export const UserSchema: Schema<typeof User> = buildSchema(User);
