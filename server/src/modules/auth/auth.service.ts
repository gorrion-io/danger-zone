import { Injectable, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/models/user.schema';
import { ICurrentUser } from './interfaces/current-user.interface';
import { Token } from './models/token.model';
import { RegisterUserInput } from './models/register-user.input';
import { MagicLinkInput } from './models/magic-link.input';
import { uuidv4 as uuid } from '../../utils/uuid';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';
import { GrantType } from './models/grant-type.enum';
import { GetTokenInput } from './models/get-token.input';
import { UsersService } from '../users/users.service';
import { SendgridMessage } from '../sendgrid/models/sendgrid-message.model';
import { HtmlEmailHelper } from '../sendgrid/helpers/html-email.helper';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { SuccessResponse } from '../common/graphql-generic-responses/success-response.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(SendgridService) private readonly sendgridService: SendgridService,
  ) {}

  async registerUser(
    dto: RegisterUserInput,
  ): Promise<SuccessResponse | ErrorResponse> {
    const user = await this.usersService.findById(dto._id);
    if (!user) {
      return new ErrorResponse(`User with id: "${dto._id}" not found.`);
    }

    if (user.isActivated) {
      return new ErrorResponse(`Your account is already activated.`);
    }

    const userByEmail = await this.usersService.findOne({ email: dto.email });
    if (userByEmail && !userByEmail._id.equals(dto._id)) {
      return new ErrorResponse(
        `User with email address: "${dto.email}" already exists.`,
      );
    }

    const linkId = uuid();

    Object.assign(user, dto);
    user.activationLinkId = linkId;

    await this.usersService.edit(user);

    const activationLink = `${process.env.BASE_URL}/activateAccount/${linkId}`;
    const message: SendgridMessage = {
      from: process.env.FROM_EMAIL_ADDRESS,
      to: user.email,
      html: HtmlEmailHelper.generateHtmlEmail(
        `<h3> Activation link: ${activationLink}</h3>`,
      ),
      subject: 'Danger zone',
      text: `Activation link: ${activationLink}`,
    };

    return this.sendgridService.send(message);
  }

  async activateAccount(id: string): Promise<Token | ErrorResponse> {
    const user = await this.usersService.findOne({ activationLinkId: id });
    if (!user) {
      return new ErrorResponse(`User for specified link does not exist.`);
    }

    user.isActivated = true;
    user.activationLinkId = null;

    await this.usersService.edit(user);

    const getTokenInput: GetTokenInput = {
      grantType: GrantType.AccessToken,
      userId: user._id,
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
      userId: user._id,
    };

    return this.getToken(getTokenInput);
  }

  async getMagicLink(
    magicLinkParam: MagicLinkInput,
  ): Promise<SuccessResponse | ErrorResponse> {
    const user = await this.usersService.findOne({
      email: magicLinkParam.email,
    });

    if (!user) {
      return new ErrorResponse(
        `User with email: "${magicLinkParam.email}" is not registered.`,
      );
    }

    if (!user.isActivated) {
      return new ErrorResponse(`User account is not activated.`);
    }

    const linkId = uuid();

    user.magicLinkId = linkId;
    user.magicLinkCreatedAt = new Date();

    await this.usersService.edit(user);

    const magicLink = `${process.env.BASE_URL}/link/${linkId}`;
    const message: SendgridMessage = {
      from: process.env.FROM_EMAIL_ADDRESS,
      to: magicLinkParam.email,
      html: HtmlEmailHelper.generateHtmlEmail(`<h3> Link: ${magicLink}</h3>`),
      subject: 'Danger zone',
      text: `Link: ${magicLink}`,
    };

    return this.sendgridService.send(message);
  }

  async getToken(getTokenInput: GetTokenInput): Promise<Token | ErrorResponse> {
    switch (getTokenInput.grantType) {
      case GrantType.AccessToken:
        const user = await this.usersService.findById(getTokenInput.userId);

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
