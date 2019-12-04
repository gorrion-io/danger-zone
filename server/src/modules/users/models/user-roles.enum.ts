import { registerEnumType } from 'type-graphql';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});
