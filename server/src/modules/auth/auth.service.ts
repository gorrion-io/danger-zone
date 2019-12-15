import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'bson';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/models/user.schema';
import { UsersService } from '../users/users.service';
import { ICurrentUser } from './interfaces/current-user.interface';
import { GrantType } from './models/grant-type.enum';
import { SignInInput } from './models/sign-in.input';
import { TokenModel } from './models/token.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async signIn(signInInput: SignInInput): Promise<TokenModel> {
    switch (signInInput.grantType) {
      case GrantType.AccessToken:
        const userName = new ObjectId(signInInput.userName.split('-')[1]);
        const user = await this.usersService.findOne(userName);
        return this.generateToken(user);
      case GrantType.RefreshToken:
        return this.refreshToken(signInInput.refreshToken);
      default:
        throw new Error('Invalid grant type.');
    }
  }

  generateToken(user: User): TokenModel {
    const tokenPayload: ICurrentUser = {
      _id: user._id,
      userName: user.userName,
    };

    const tokenResponse = new TokenModel();
    tokenResponse.token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    tokenResponse.refreshToken = jwt.sign(
      tokenPayload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '1w' },
    );

    return tokenResponse;
  }

  async refreshToken(token: string): Promise<TokenModel> {
    const userToken = this.checkToken(token, process.env.JWT_REFRESH_SECRET);
    if (!userToken) {
      throw new Error('Invalid token');
    }
    const user = await this.usersService.findOne(userToken._id);
    if (!user) {
      throw new Error('User has no access');
    }

    return this.generateToken(user);
  }

  verifyToken(token: string): ICurrentUser {
    return this.checkToken(token, process.env.JWT_SECRET);
  }

  private checkToken(token: string, secret: string): ICurrentUser {
    const currentUser: ICurrentUser = jwt.verify(token, secret) as ICurrentUser;

    return currentUser;
  }
}
