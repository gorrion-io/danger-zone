import { ObjectId } from 'bson';
import { Field, InputType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';

@InputType()
export class FindAllCommentsInput {
  @Field(() => ObjectIdScalar)
  reportId: ObjectId;

  @Field(() => ObjectIdScalar, { nullable: true })
  answeredTo?: ObjectId;
}
