import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/modules/users/models/user-roles.enum';
import { ICurrentUser } from '../interfaces/current-user.interface';
import { authorizeUser } from 'src/utils/authorize-user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();

    const user: ICurrentUser = ctx.user;

    const roles = this.reflector.get<Role[]>('roles', ctx.getClass());

    if (!roles) {
      return false;
    }

    return authorizeUser(user, roles);
  }
}
