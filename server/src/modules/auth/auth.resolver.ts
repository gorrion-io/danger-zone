import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Token } from './models/token.model';
import { RegisterUserInput } from './models/register-user.input';
import { SuccessResponse } from '../common/graphql-generic-responses/success-response.model';
import { MailService } from '../common/mail.service';
import { MagicLinkInput } from './models/magic-link.input';
import { LoginUserInput } from './models/login-user.input';
import { MagicLinkUnion } from './unions/magic-link.union';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';

@Resolver(() => Token)
export class AuthResolver {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(MailService) private readonly mailService: MailService,
  ) {}

  @Mutation(() => Token)
  async register(
    @Args('registerUserParam') param: RegisterUserInput,
  ): Promise<Token> {
    const user = await this.authService.registerUser(param);

    return this.authService.generateToken(user);
  }

  @Mutation(() => Token)
  async login(@Args('loginUserParam') param: LoginUserInput): Promise<Token> {
    const user = await this.authService.login(param);

    return this.authService.generateToken(user);
  }

  @Mutation(() => MagicLinkUnion)
  async sendMagicLink(
    @Args('magicLinkParam') magicLinkParam: MagicLinkInput,
  ): Promise<SuccessResponse | ErrorResponse> {
    const magicLink = await this.authService.getMagicLink(magicLinkParam);

    const subject = 'Danger zone';
    const htmlBody = `
    <html>
      <header>
      </header>
      <body>
        <h3> Link: ${magicLink}</h3>
      </body>
    </html>
    `;

    return await this.mailService.sendMail(
      magicLinkParam.email,
      subject,
      '',
      htmlBody,
    );
  }
}
