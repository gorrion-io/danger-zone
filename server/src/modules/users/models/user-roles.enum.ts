import { registerEnumType } from 'type-graphql';

export enum Roles {
  USER,
  ADMIN,
  MODERATOR,
}

registerEnumType(Roles, {
  name: 'Roles',
  description: 'Possible roles for users',
});
