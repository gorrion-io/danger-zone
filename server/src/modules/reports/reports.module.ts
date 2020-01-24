import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../common/common.module';
import { Report, ReportSchema } from './models/report.schema';
import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';
import { AuthModule } from '../auth/auth.module';

const services = [ReportsService];
const resolvers = [ReportsResolver];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    CommonModule,
    AuthModule,
  ],
  providers: [...services, ...resolvers],
})
export class ReportsModule {}
