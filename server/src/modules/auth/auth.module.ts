import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/user-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/models/user.schema';
import { AuthResolver } from './auth.resolver';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CommonModule,
  ],
  providers: [AuthService, AuthGuard, AuthResolver],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
