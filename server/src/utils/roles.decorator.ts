import { SetMetadata } from '@nestjs/common';
import { Role } from '../modules/users/models/user-roles.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
