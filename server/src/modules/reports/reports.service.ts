import { Injectable, Scope, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
import { AddReportInput } from './models/add-report.input';
import { EditReportInput } from './models/edit-report.input';
import { Report } from './models/report.schema';
import { ObjectID } from 'bson';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: ReturnModelType<typeof Report>,
  ) {}

  async findAll(): Promise<Report[]> {
    return this.reportModel.find().exec();
  }

  async findOne(id: ObjectIdScalar): Promise<Report> {
    return this.reportModel.findById(id);
  }

  async add(dto: AddReportInput, userID: ObjectID): Promise<Report> {
    const report = new this.reportModel();
    Object.assign(report, dto);
    report.reportedBy = userID;

    return report.save();
  }

  async edit(dto: EditReportInput, userID: ObjectID): Promise<Report> {
    const report = await this.reportModel.findById(dto._id);
    if (!report || !report.reportedBy.equals(userID)) {
      throw new Error(`Report with id: "${dto._id}" not found.`);
    }
    Object.assign(report, dto);

    return report.save();
  }
}
