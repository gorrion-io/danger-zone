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

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join('src', 'schema.gql'),
      context: ({ req }) => ({ headers: req.headers }),
    }),
    MongooseModule.forRoot(`mongodb://mongo/wpierdol`),
    SendgridModule.forRoot(new SendgridOptions(process.env.SENDGRID_API_KEY)),
    UsersModule,
    ReportsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
