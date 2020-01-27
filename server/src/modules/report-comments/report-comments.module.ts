import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import {
  ReportComment,
  ReportCommentSchema,
} from './models/report-comment.schema';
import { ReportCommentsResolver } from './report-comments.resolver';
import { ReportCommentsService } from './report-comments.service';

const services = [ReportCommentsService];
const resolvers = [ReportCommentsResolver];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportComment.name, schema: ReportCommentSchema },
    ]),
    CommonModule,
    AuthModule,
  ],
  providers: [...services, ...resolvers],
})
export class ReportCommentsModule {}
