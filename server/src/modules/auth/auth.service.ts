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
}
