import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/models/user-role.enum';

export const Roles = (role: Role) => SetMetadata('role', role);
