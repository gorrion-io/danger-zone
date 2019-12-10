import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuardAuthorization } from './guards/user-authorization.guard';
import { AuthGuardAuthentication } from './guards/user-authentication.guard';

@Module({
  providers: [AuthService, AuthGuardAuthorization, AuthGuardAuthentication],
  exports: [AuthService, AuthGuardAuthorization, AuthGuardAuthentication],
})

export class AuthModule { }
