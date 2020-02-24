import { registerEnumType } from 'type-graphql';

export enum Role {
  Admin = 'administrator',
  Maintainer = 'maintainer',
  StandardUser = 'standard-user',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'Available user roles',
});
