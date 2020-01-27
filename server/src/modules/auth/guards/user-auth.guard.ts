import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { ICurrentUser } from '../interfaces/current-user.interface';
import { Role } from '../../users/models/user-role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext: any = GqlExecutionContext.create(context).getContext();
    if (!gqlContext.headers.authorization) {
      return false;
    }

    const userAccessToken = gqlContext.headers.authorization.split(' ').pop();
    const user: ICurrentUser = this.authService.verifyToken(userAccessToken);

    if (!user) {
      return false;
    }
    gqlContext.user = user;

    // Handle roles
    const role = this.reflector.get<Role>('role', context.getHandler());
    if (!role) {
      return true;
    }

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
