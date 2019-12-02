import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/models/user.schema';
import { ICurrentUser } from './interfaces/current-user.interface';
import { TokenModel } from './models/token.model';
import { ObjectId } from 'bson';

@Injectable()
export class AuthService {
  constructor(
  ) { }

  generateToken(user: User): TokenModel {
    const tokenPayload: ICurrentUser = {
      _id: user._id,
      userName: user.userName,
    };

    const tokenResponse = new TokenModel();
    tokenResponse.token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    tokenResponse.refreshToken = jwt.sign(tokenPayload, this.getRefreshTokenSecret(), {
      expiresIn: '7d',
    });

    return tokenResponse;
  }

  async refreshAccessToken(refreshToken: string, findUserById: (id: ObjectId) => Promise<User>): Promise<TokenModel> {
    const userPayload = this.verifyToken(refreshToken, this.getRefreshTokenSecret());

    if (!userPayload) {
      throw Error('Invalid refresh token.');
    }

    const user = await findUserById(userPayload._id);
    if (!user) {
      throw Error('User not found.');
    }
    // TODO user validation (eg isBlocked)

    return this.generateToken(user);
  }

  verifyToken(token: string, secret = process.env.JWT_SECRET): ICurrentUser {
    const currentUser: ICurrentUser = jwt.verify(
      token,
      secret,
    ) as ICurrentUser;

    return currentUser;
  }

  private getRefreshTokenSecret(): string {
    return `${process.env.JWT_SECRET}-refreshtoken`;
  }
}
