import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/models/user.schema';
import { ICurrentUser } from './interfaces/current-user.interface';
import { Token } from './models/token.model';
import { RegisterUserInput } from './models/register-user.input';
import { hashPassword } from '../../utils/hash-password';
import { MagicLinkInput } from './models/magic-link.input';
import { v4 as uuid } from 'uuid';
import { LoginUserInput } from './models/login-user.input';
import { verifyPassword } from '../../utils/verify-password';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';
import { GrantType } from './models/grant-type.enum';
import { GetTokenInput } from './models/get-token.input';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registerUser(dto: RegisterUserInput): Promise<Token | ErrorResponse> {
    const userByEmail = await this.usersService.findOne({ email: dto.email });

    if (userByEmail && dto._id.equals(userByEmail._id)) {
      return new ErrorResponse(`Your accoount is already registered.`);
    }

    if (userByEmail) {
      return new ErrorResponse(
        `User with email address: "${dto.email}" already exists.`,
      );
    }

    const user = await this.usersService.findById(dto._id);
    if (!user) {
      return new ErrorResponse(`User with id: "${dto._id}" not found.`);
    }

    dto.password = await hashPassword(dto.password);
    Object.assign(user, dto);

    await this.usersService.edit(user);

    const getTokenInput: GetTokenInput = {
      grantType: GrantType.AccessToken,
      userName: `${user.userName}-${user._id}`,
    };

    return this.getToken(getTokenInput);
  }

  async login(dto: LoginUserInput): Promise<Token | ErrorResponse> {
    const user = await this.usersService.findOne({ email: dto.email });
    if (!user) {
      return new ErrorResponse(
        `User with email address: "${dto.email}" not found.`,
      );
    }

    if (!user.password) {
      return new ErrorResponse(
        `User with email address: "${dto.email}" is not registered.`,
      );
    }

    if (!(await verifyPassword(user.password, dto.password))) {
      return new ErrorResponse(`Wrong email or password.`);
    }

    const getTokenInput: GetTokenInput = {
      grantType: GrantType.AccessToken,
      userName: `${user.userName}-${user._id}`,
    };

    return this.getToken(getTokenInput);
  }

  async loginByMagicLink(id: string): Promise<Token | ErrorResponse> {
    const user = await this.usersService.findOne({ magicLinkId: id });
    if (!user) {
      return new ErrorResponse(`User for specified link does not exist.`);
    }

    const mlTime = Number(process.env.MAGIC_LINK_TIME);
    const dateNow = new Date();
    const createdDate = new Date(user.magicLinkCreatedAt);

    createdDate.setSeconds(
      createdDate.getSeconds() + mlTime ? mlTime : 300, // 5 minutes default
    );

    if (createdDate < dateNow) {
      return new ErrorResponse(`Link has expired.`);
    }

    const getTokenInput: GetTokenInput = {
      grantType: GrantType.AccessToken,
      userName: `${user.userName}-${user._id}`,
    };

    return this.getToken(getTokenInput);
  }

  async getMagicLink(
    magicLinkParam: MagicLinkInput,
  ): Promise<string | ErrorResponse> {
    const user = await this.usersService.findOne({
      email: magicLinkParam.email,
    });

    if (!user || !user.password) {
      return new ErrorResponse(
        `User with email: "${magicLinkParam.email}" is not registered.`,
      );
    }

    const linkId = uuid();

    user.email = magicLinkParam.email;
    user.magicLinkId = linkId;
    user.magicLinkCreatedAt = new Date();

    await this.usersService.edit(user);

    return `${process.env.BASE_URL}/link/${linkId}`;
  }

  async getToken(getTokenInput: GetTokenInput): Promise<Token | ErrorResponse> {
    switch (getTokenInput.grantType) {
      case GrantType.AccessToken:
        const id = getTokenInput.userName.split('-').pop();
        const user = await this.usersService.findById(id);

        return this.generateToken(user);

      case GrantType.RefreshToken:
        return this.refreshToken(getTokenInput.refreshToken);

      default:
        return new ErrorResponse('Invalid grant type.');
    }
  }

  async refreshToken(token: string): Promise<Token | ErrorResponse> {
    const userToken = this.checkToken(token, process.env.JWT_REFRESH_SECRET);
    if (!userToken) {
      return new ErrorResponse('Invalid token.');
    }

    const user = await this.usersService.findById(userToken._id);
    if (!user) {
      return new ErrorResponse('User has no access.');
    }

    return this.generateToken(user);
  }

  generateToken(user: User): Token {
    const tokenPayload: ICurrentUser = {
      _id: user._id,
      userName: user.userName,
    };

    const tokenResponse = new Token();
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

  verifyToken(token: string): ICurrentUser {
    return this.checkToken(token, process.env.JWT_SECRET);
  }

  private checkToken(token: string, secret: string): ICurrentUser {
    const currentUser: ICurrentUser = jwt.verify(token, secret) as ICurrentUser;

    return currentUser;
  }
}
