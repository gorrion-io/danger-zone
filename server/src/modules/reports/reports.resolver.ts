import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/user-auth.guard';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
import { Role } from '../users/models/user-role.enum';
import { AddReportInput } from './models/add-report.input';
import { EditReportInput } from './models/edit-report.input';
import { Report } from './models/report.schema';
import { ReportsService } from './reports.service';
import { User } from '../users/models/user.schema';
import { GenericResponseUnion } from '../common/unions/generic-response.union';
import { SuccessResponse } from '../common/graphql-generic-responses/success-response.model';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';
@Resolver(() => Report)
@UseGuards(AuthGuard)
export class ReportsResolver {
  constructor(
    @Inject(ReportsService) private readonly reportsService: ReportsService,
  ) {}

  @ResolveProperty(type => User)
  async reportedBy(@Parent() report: Report): Promise<User> {
    return this.reportsService.resolveUser(report.reportedBy);
  }
  @Roles(Role.StandardUser)
  @Query(() => [Report])
  async findAllReports(): Promise<Report[]> {
    return this.reportsService.findAll();
  }

  @Roles(Role.StandardUser)
  @Query(() => Report)
  async findReport(@Args('id') id: ObjectIdScalar): Promise<Report> {
    return this.reportsService.findById(id);
  }

  @Roles(Role.StandardUser)
  @Mutation(() => Report)
  async addReport(
    @Args('report') reportInput: AddReportInput,
    @Context('user') user: ICurrentUser,
  ): Promise<Report> {
    return this.reportsService.add(reportInput, user);
  }

  @Roles(Role.StandardUser)
  @Mutation(() => Report)
  async editReport(
    @Args('report') reportInput: EditReportInput,
    @Context('user') user: ICurrentUser,
  ): Promise<Report> {
    return this.reportsService.edit(reportInput, user);
  }

  @Roles(Role.Admin)
  @Mutation(() => GenericResponseUnion)
  async deleteReport(
    @Args('id') id: ObjectIdScalar,
  ): Promise<SuccessResponse | ErrorResponse> {
    return this.reportsService.delete(id);
  }
}
