import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/models/user.schema';
import { ICurrentUser } from './interfaces/current-user.interface';
import { TokenModel } from './models/token.model';

@Injectable()
export class AuthService {
  generateToken(user: User): TokenModel {
    const tokenPayload: ICurrentUser = {
      _id: user._id,
      userName: user.userName,
    };

    const tokenResponse = new TokenModel();

    tokenResponse.accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '15min',
    });
    tokenResponse.refreshToken = jwt.sign(tokenPayload, process.env.JWT_SECRET_JWT, {
      expiresIn: '7d',
    });
    return tokenResponse;
  }

  verifyToken(token: string, secret: string = process.env.JWT_SECRET): ICurrentUser {
    const currentUser: ICurrentUser = jwt.verify(
      token,
      secret,
    ) as ICurrentUser;

    return currentUser;
  }

  refreshToken(token: string): TokenModel {
    const loggedUser = this.verifyToken(token, process.env.JWT_SECRET_REFRESH);
    if (!!loggedUser) {
      return this.generateToken(loggedUser);
    } else {
      throw new Error(`Token expired`);
    }
  }
}
