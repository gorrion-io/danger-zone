import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { TokenModel } from '../auth/models/token.model';

@Resolver(() => TokenModel)
export class AuthResolver {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) { }

  @Mutation(() => TokenModel)
  async refreshAccessToken(@Args('refreshToken') refreshToken: string): Promise<TokenModel> {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
