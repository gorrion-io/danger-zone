import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { ICurrentUser } from '../interfaces/current-user.interface';
import { ROLE } from '../../../constants/enums';

@Injectable()
export class AuthGuardAuthorization implements CanActivate {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(Reflector) private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext: any = GqlExecutionContext.create(context).getContext();
    const user: ICurrentUser = gqlContext.user;
    const roles = this.reflector.get<ROLE[]>('roles', context.getHandler());

    console.log(user)
    console.log(roles)
    
    const result: boolean = this.authService.authChecker(user, roles);

    return result;
  }
}
