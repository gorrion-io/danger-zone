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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async registerUser(dto: RegisterUserInput): Promise<User> {
    const userByEmail = await this.userModel.findOne({ email: dto.email });

    if (userByEmail && dto._id.equals(userByEmail._id)) {
      throw new Error(`Your accoount is already registered.`);
    }

    if (userByEmail) {
      throw new Error(
        `User with email address: "${dto.email}" already exists.`,
      );
    }

    const user = await this.userModel.findById(dto._id);
    if (!user) {
      throw new Error(`User with id: "${dto._id}" not found.`);
    }

    dto.password = await hashPassword(dto.password);
    Object.assign(user, dto);

    return user.save();
  }

  async login(dto: LoginUserInput): Promise<User> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new Error(`User with email address: "${dto.email}" not found.`);
    }

    if (!user.password) {
      throw new Error(
        `User with email address: "${dto.email}" is not registered.`,
      );
    }

    if (!verifyPassword(user.password, dto.password)) {
      throw new Error(`Wrong email or password.`);
    }

    return user;
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
