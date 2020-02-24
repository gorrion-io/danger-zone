import { createUnionType } from 'type-graphql';
import { ErrorResponse } from '../../common/graphql-generic-responses/error-response.model';
import { Token } from '../models/token.model';

export const TokenUnion = createUnionType({
  name: 'TokenUnion',
  types: () => [Token, ErrorResponse],
});
