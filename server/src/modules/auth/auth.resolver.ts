import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Token } from './models/token.model';
import { RegisterUserInput } from './models/register-user.input';
import { SuccessResponse } from '../common/graphql-generic-responses/success-response.model';
import { MagicLinkInput } from './models/magic-link.input';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';
import { TokenUnion } from './unions/token.union';
import { GetTokenInput } from './models/get-token.input';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { GenericResponseUnion } from '../common/unions/generic-response.union';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(SendgridService) private readonly sendgridService: SendgridService,
  ) {}

  @Mutation(() => GenericResponseUnion)
  async register(
    @Args('registerUserParam') param: RegisterUserInput,
  ): Promise<SuccessResponse | ErrorResponse> {
    return this.authService.registerUser(param);
  }

  @Mutation(() => TokenUnion)
  async token(
    @Args('getToken') getTokenInput: GetTokenInput,
  ): Promise<Token | ErrorResponse> {
    return this.authService.getToken(getTokenInput);
  }

  @Mutation(() => TokenUnion)
  async activateAccount(
    @Args('activationLinkId') id: string,
  ): Promise<Token | ErrorResponse> {
    return this.authService.activateAccount(id);
  }

  @Mutation(() => TokenUnion)
  async loginByMagicLink(
    @Args('magicLinkId') id: string,
  ): Promise<Token | ErrorResponse> {
    return this.authService.loginByMagicLink(id);
  }

  @Mutation(() => GenericResponseUnion)
  async sendMagicLink(
    @Args('magicLinkParam') magicLinkParam: MagicLinkInput,
  ): Promise<SuccessResponse | ErrorResponse> {
    return this.authService.getMagicLink(magicLinkParam);
  }
}
