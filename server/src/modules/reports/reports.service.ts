import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
import { AddReportInput } from './models/add-report.input';
import { EditReportInput } from './models/edit-report.input';
import { Report } from './models/report.schema';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { User } from '../users/models/user.schema';
import { UsersService } from '../users/users.service';
import { ObjectId } from 'bson';

@Injectable()
export class ReportsService {

  constructor(
    @InjectModel(Report.name)
    private readonly reportModel: ReturnModelType<typeof Report>,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async resolveUser(reportedBy: any): Promise<User> {
   return this.usersService.findOne(reportedBy);
  }

  async findAll(): Promise<Report[]> {
    return this.reportModel.find().exec();
  }

  async findOne(id: ObjectIdScalar): Promise<Report> {
    return this.reportModel.findById(id);
  }

  async add(dto: AddReportInput, user: ICurrentUser): Promise<Report> {
    const report = new this.reportModel();
    Object.assign(report, dto);
    report.creationDate = new Date();
    report.lastEditDate = new Date();
    report.reportedBy = user._id;

    return report.save();
  }

  async edit(dto: EditReportInput, user: ICurrentUser): Promise<Report> {
    const report = await this.reportModel.findById(dto._id);
    // if (!report || !report.reportedBy.equals(user._id)) {
    //   throw new Error(`Report with id: "${dto._id}" not found.`);
    // }
    Object.assign(report, dto);

    return report.save();
  }

  async delete(id: ObjectIdScalar): Promise<ObjectIdScalar> {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new Error(`Report with id: "${id}" not found.`);
    }

    report.isDeleted = true;
    report.save();

    return report.id;
  }
}
