import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { ObjectIdScalar } from 'src/modules/common/graphql-scalars/object-id.scalar';
import { AuthService } from '../auth.service';
import { ICurrentUser } from '../interfaces/current-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext: any = GqlExecutionContext.create(context).getContext();
    if (!gqlContext.headers.authorization) {
      return false;
    }

    const userAccessToken = gqlContext.headers.authorization.split(' ').pop();
    try {
      const user: ICurrentUser = this.authService.verifyToken(userAccessToken);
      if (!user) {
        return false;
      }
      gqlContext.user = user;

      return true;
    } catch {
      const userId: ObjectIdScalar = this.authService.verifyRefreshToken(
        userAccessToken,
      );
      if (!userId) {
        return false;
      }
      gqlContext.userId = userId;

      return true;
    }
  }
}
