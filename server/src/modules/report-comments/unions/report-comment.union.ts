import { createUnionType } from 'type-graphql';
import { ErrorResponse } from '../../common/graphql-generic-responses/error-response.model';
import { ReportComment } from '../models/report-comment.schema';

export const ReportCommentUnion = createUnionType({
  name: 'ReportCommentUnion',
  types: () => [ErrorResponse, ReportComment],
});
