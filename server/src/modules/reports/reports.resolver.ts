import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/guards/user-auth.guard';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
import { AddReportInput } from './models/add-report.input';
import { EditReportInput } from './models/edit-report.input';
import { Report } from './models/report.schema';
import { ReportsService } from './reports.service';

@Resolver(() => Report)
export class ReportsResolver {
  constructor(
    @Inject(ReportsService) private readonly reportsService: ReportsService,
  ) {}

  @Query(() => [Report])
  async findAllReports(): Promise<Report[]> {
    return this.reportsService.findAll();
  }

  @Query(() => Report)
  async findReport(@Args('id') id: ObjectIdScalar): Promise<Report> {
    return this.reportsService.findOne(id);
  }

  @Mutation(() => Report)
  @UseGuards(AuthGuard)
  async addReport(
    @Args('report') reportInput: AddReportInput, @Context('user') user: ICurrentUser
  ): Promise<Report> {
    return this.reportsService.add(reportInput, user);
  }

  @Mutation(() => Report)
  @UseGuards(AuthGuard)
  async editReport(
    @Args('report') reportInput: EditReportInput, @Context('user') user: ICurrentUser
  ): Promise<Report> {
    return this.reportsService.edit(reportInput, user);
  }
}
