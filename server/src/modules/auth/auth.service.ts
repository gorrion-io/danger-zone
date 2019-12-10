import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/models/user.schema';
import { ICurrentUser } from './interfaces/current-user.interface';
import { TokenModel } from './models/token.model';
import { ROLE } from '../../constants/enums'

@Injectable()
export class AuthService {
  generateToken(user: User): TokenModel {
    const tokenPayload: ICurrentUser = {
      _id: user._id,
      userName: user.userName,
      role: user.role
    };

    const tokenResponse = new TokenModel();
    tokenResponse.token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return tokenResponse;
  }

  verifyToken(token: string): ICurrentUser {
    const currentUser: ICurrentUser = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as ICurrentUser;

    return currentUser;
  }

  authChecker(user: ICurrentUser, roles: ROLE[]) {
    if (roles.length === 0) {
      // if `@Authorized()`, check only is user exist
      return user !== undefined;
    }
    // there are some roles defined now

    if (!user) {
      // and if no user, restrict access
      return false;
    }
    if (roles.includes(user.role)) {
      // grant access if the roles overlap
      return true;
    }

    // no roles matched, restrict access
    return false;
  }
}
