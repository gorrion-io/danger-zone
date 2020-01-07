import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './models/sign-in.input';
import { TokenModel } from './models/token.model';

@Resolver(() => TokenModel)
export class AuthResolver {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Mutation(() => TokenModel)
  async token(@Args('signIn') signInInput: SignInInput): Promise<TokenModel> {
    return this.authService.signIn(signInInput);
  }
}
