import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/guards/user-auth.guard';
import { TokenModel } from './models/token.model';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  @Mutation(() => TokenModel)
  async refreshToken(@Args('token') token: string): Promise<TokenModel> {
    return this.authService.refreshToken(token);
  }
}
