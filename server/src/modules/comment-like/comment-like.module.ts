import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { UsersModule } from '../users/users.module';
import { CommentLike, CommentLikeSchema } from './models/comment-like.schema';
import { CommentLikeService } from './comment-like.service';
import { CommentLikeResolver } from './comment-like.resolver';
import { ReportCommentsModule } from '../report-comments/report-comments.module';

const services = [CommentLikeService];
const resolvers = [CommentLikeResolver];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),
    forwardRef(() => ReportCommentsModule),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  providers: [...services, ...resolvers],
  exports: [CommentLikeService],
})
export class CommentLikeModule {}
