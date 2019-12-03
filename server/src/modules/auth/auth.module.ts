import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/user-auth.guard';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';

@Global()
@Module({
  imports: [UsersModule],
  providers: [AuthService, AuthGuard, AuthResolver],
  exports: [AuthService, AuthGuard],
})
export class AuthModule { }
