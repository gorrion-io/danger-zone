import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data, [root, args, gqlContext, info]) => gqlContext.user,
);
