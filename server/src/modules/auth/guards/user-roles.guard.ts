import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../users/models/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const role = this.reflector.get<Role>('role', context.getHandler());
    if (!role) {
      return true;
    }
    const ctx = context.getArgByIndex(2);
    const user = ctx.user;
    // const hasRole = () => user.role === role;

    if (user && user.role && this.checkRoles(user.role, role)) {
      return true;
    }
    return false;
  }

  private checkRoles(userRole: Role, role: Role): boolean {
    const adminAccess = [Role.Admin, Role.Maintainer, Role.StandardUser];
    const maintainerAccess = [Role.Maintainer, Role.StandardUser];
    const standardAccess = [Role.StandardUser];

    switch (userRole) {
      case Role.Admin:
        return adminAccess.includes(role);
      case Role.Maintainer:
        return maintainerAccess.includes(role);
      case Role.StandardUser:
        return standardAccess.includes(role);
      default:
        return false;
    }
    return false;
  }
}
