import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/models/user.schema';
import { ICurrentUser } from './interfaces/current-user.interface';
import { Token } from './models/token.model';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { RegisterUserInput } from './models/register-user.input';
import { hashPassword } from '../../utils/hash-password';
import { MagicLinkInput } from './models/magic-link.input';
import { v4 as uuid } from 'uuid';
import { LoginUserInput } from './models/login-user.input';
import { verifyPassword } from '../../utils/verify-password';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async registerUser(dto: RegisterUserInput): Promise<Token | ErrorResponse> {
    const userByEmail = await this.userModel.findOne({ email: dto.email });

    if (userByEmail && dto._id.equals(userByEmail._id)) {
      return new ErrorResponse(`Your accoount is already registered.`);
    }

    if (userByEmail) {
      return new ErrorResponse(
        `User with email address: "${dto.email}" already exists.`,
      );
    }

    const user = await this.userModel.findById(dto._id);
    if (!user) {
      return new ErrorResponse(`User with id: "${dto._id}" not found.`);
    }

    dto.password = await hashPassword(dto.password);
    Object.assign(user, dto);

    user.save();

    return this.generateToken(user);
  }

  async login(dto: LoginUserInput): Promise<Token | ErrorResponse> {
    const user = await this.userModel.findOne({ email: dto.email });
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

    return this.generateToken(user);
  }

  async getMagicLink(magicLinkParam: MagicLinkInput): Promise<string> {
    const user = await this.userModel.findById(magicLinkParam._id);
    if (!user) {
      throw new Error(`User with id: "${magicLinkParam._id}" not found.`);
    }

    const linkId = uuid();

    user.email = magicLinkParam.email;
    user.magicLinkId = linkId;
    user.magicLinkCreatedAt = new Date();

    user.save();

    return `${process.env.BASE_URL}/link?id=${linkId}`;
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
