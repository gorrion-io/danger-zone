import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
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
    tokenResponse.refreshToken = jwt.sign(
      { sub: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '1w' },
    );

    return tokenResponse;
  }

  verifyToken(token: string): ICurrentUser {
    const currentUser: ICurrentUser = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as ICurrentUser;

    return currentUser;
  }

  verifyRefreshToken(token: string): ObjectIdScalar {
    const payload: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    return payload.sub as ObjectIdScalar;
  }
}
