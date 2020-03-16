import { ObjectId } from 'bson';
import { Field, InputType } from 'type-graphql';
import { ObjectIdScalar } from '../../common/graphql-scalars/object-id.scalar';
import { LikeType } from './like-type.enum';

@InputType()
export class UpdateCommentLikeInput {
  @Field(() => ObjectIdScalar)
  commentId: ObjectId;

  @Field(() => LikeType)
  likeType: LikeType;
}
