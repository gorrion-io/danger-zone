import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../common/common.module';
import { User, UserSchema } from './models/user.schema';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';

const services = [UsersService];
const resolvers = [UsersResolver];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CommonModule,
    AuthModule,
  ],
  providers: [...services, ...resolvers],
  exports: [UsersService],
})
export class UsersModule {}
