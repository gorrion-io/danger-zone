import { buildSchema, prop as Property } from '@typegoose/typegoose';
import { ObjectId } from 'bson';
import { Schema } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';
import { User } from '../../users/models/user.schema';

@ObjectType()
export class Report {
    @Field(() => ObjectIdScalar)
    readonly _id: ObjectId;

    @Field()
    @Property({ required: true, maxlength: 50 })
    title: string;

    @Field()
    @Property({ required: true, maxlength: 250 })
    description: string;

    @Field(() => ObjectIdScalar)
    @Property({ ref: User })
    reportedBy: ObjectId;
}

export const ReportSchema: Schema<typeof Report> = buildSchema(Report);
