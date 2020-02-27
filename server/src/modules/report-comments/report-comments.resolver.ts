import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/guards/user-auth.guard';
import { ICurrentUser } from '../auth/interfaces/current-user.interface';
import { ObjectIdScalar } from '../common/graphql-scalars/object-id.scalar';
import { AddReportCommentInput } from './models/add-report-comment.input';
import { EditReportCommentInput } from './models/edit-report-comment.input';
import { ReportComment } from './models/report-comment.schema';
import { ReportCommentsService } from './report-comments.service';

@Resolver(() => ReportComment)
export class ReportCommentsResolver {
  constructor(
    @Inject(ReportCommentsService)
    private readonly reportCommentsService: ReportCommentsService,
  ) {}

  @Query(() => [ReportComment])
  async findAllComments(
    @Args('id') reportId: ObjectIdScalar,
  ): Promise<ReportComment[]> {
    return this.reportCommentsService.findAll(reportId);
  }

  @Query(() => ReportComment)
  async findComment(@Args('id') id: ObjectIdScalar): Promise<ReportComment> {
    return this.reportCommentsService.findOne(id);
  }

  @Mutation(() => ReportComment)
  @UseGuards(AuthGuard)
  async addReportComment(
    @Args('comment') reportInput: AddReportCommentInput,
    @Context('user') user: ICurrentUser,
  ): Promise<ReportComment> {
    return this.reportCommentsService.add(reportInput, user);
  }

  @Mutation(() => ReportComment)
  async editReport(
    @Args('comment') reportInput: EditReportCommentInput,
  ): Promise<ReportComment> {
    return this.reportCommentsService.edit(reportInput);
  }
}
