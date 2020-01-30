import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Token } from './models/token.model';
import { RegisterUserInput } from './models/register-user.input';
import { SuccessResponse } from '../common/graphql-generic-responses/success-response.model';
import { MagicLinkInput } from './models/magic-link.input';
import { LoginUserInput } from './models/login-user.input';
import { MagicLinkUnion } from './unions/magic-link.union';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';
import { TokenUnion } from './unions/token.union';
import { GetTokenInput } from './models/get-token.input';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { SendgridMessage } from '../sendgrid/models/sendgrid-message.model';
import { HtmlEmailHelper } from '../sendgrid/helpers/html-email.helper';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(SendgridService) private readonly sendgridService: SendgridService,
  ) {}

  @Mutation(() => TokenUnion)
  async register(
    @Args('registerUserParam') param: RegisterUserInput,
  ): Promise<Token | ErrorResponse> {
    return this.authService.registerUser(param);
  }

  @Mutation(() => TokenUnion)
  async token(
    @Args('getToken') getTokenInput: GetTokenInput,
  ): Promise<Token | ErrorResponse> {
    return this.authService.getToken(getTokenInput);
  }

  @Mutation(() => TokenUnion)
  async login(
    @Args('loginUserParam') param: LoginUserInput,
  ): Promise<Token | ErrorResponse> {
    return this.authService.login(param);
  }

  @Mutation(() => TokenUnion)
  async loginByMagicLink(
    @Args('magicLinkId') id: string,
  ): Promise<Token | ErrorResponse> {
    return this.authService.loginByMagicLink(id);
  }

  @Mutation(() => MagicLinkUnion)
  async sendMagicLink(
    @Args('magicLinkParam') magicLinkParam: MagicLinkInput,
  ): Promise<SuccessResponse | ErrorResponse> {
    const magicLinkResponse = await this.authService.getMagicLink(
      magicLinkParam,
    );

    if (magicLinkResponse instanceof ErrorResponse) {
      return magicLinkResponse as ErrorResponse;
    }

    const message: SendgridMessage = {
      from: process.env.FROM_EMAIL_ADDRESS,
      to: magicLinkParam.email,
      html: HtmlEmailHelper.generateHtmlEmail(
        `<h3> Link: ${magicLinkResponse}</h3>`,
      ),
      subject: 'Danger zone',
      text: `Link: ${magicLinkResponse}`,
    };

    return this.sendgridService.send(message);
  }
}
