import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/user-auth.guard';
import { RolesGuard } from './guards/user-roles.guard';

@Module({
  imports: [UsersModule],
  providers: [AuthService, AuthGuard, AuthResolver, RolesGuard],
  exports: [AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
