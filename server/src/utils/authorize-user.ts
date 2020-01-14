import { ICurrentUser } from 'src/modules/auth/interfaces/current-user.interface';
import { Role } from 'src/modules/users/models/user-roles.enum';

export const authorizeUser = (
  user: ICurrentUser,
  roles: Role[] = [],
): boolean => {
  // if authorizing user without specifying any role
  if (roles.length === 0 && user !== undefined) {
    return true;
  }

  // check if user exists and if any of their roles exists in roles array given as an argument
  if (user && roles.some(value => user.roles.includes(value))) {
    return true;
  }

  return false;
};
