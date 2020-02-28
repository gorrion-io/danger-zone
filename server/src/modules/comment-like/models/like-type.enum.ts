import { registerEnumType } from 'type-graphql';

export enum LikeType {
  Like = 'like',
  Dislike = 'dislike',
  None = 'none',
}

registerEnumType(LikeType, {
  name: 'LikeType',
  description: 'Comment like or dislike',
});
