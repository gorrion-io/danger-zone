import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuthModule } from './modules/auth/auth.module';
import { SendgridModule } from './modules/sendgrid/sendgrid.module';
import { SendgridOptions } from './modules/sendgrid/models/sendgrid-options.model';
import { ReportCommentsModule } from './modules/report-comments/report-comments.module';
import { CommentLikeModule } from './modules/comment-like/comment-like.module';
import { PubSubModule } from './modules/pub-sub/pub-sub.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join('src', 'schema.gql'),
      context: ({ req, connection }) => ({
        headers: connection ? connection.context : req.headers,
      }),
      installSubscriptionHandlers: true,
    }),
    MongooseModule.forRoot(`mongodb://mongo/wpierdol`),
    SendgridModule.forRoot(new SendgridOptions(process.env.SENDGRID_API_KEY)),
    PubSubModule,
    UsersModule,
    ReportsModule,
    AuthModule,
    ReportCommentsModule,
    CommentLikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
