import { createUnionType } from 'type-graphql';
import { SuccessResponse } from '../graphql-generic-responses/success-response.model';
import { ErrorResponse } from '../graphql-generic-responses/error-response.model';

export const GenericResponseUnion = createUnionType({
  name: 'GenericResponse',
  types: () => [SuccessResponse, ErrorResponse],
});
