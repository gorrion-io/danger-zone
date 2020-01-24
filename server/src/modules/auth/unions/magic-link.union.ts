import { createUnionType } from 'type-graphql';
import { SuccessResponse } from '../../common/graphql-generic-responses/success-response.model';
import { ErrorResponse } from '../../common/graphql-generic-responses/error-response.model';

export const MagicLinkUnion = createUnionType({
  name: 'MagicLink',
  types: () => [SuccessResponse, ErrorResponse],
});
