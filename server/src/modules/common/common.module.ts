import { Module } from '@nestjs/common';
import { ObjectIdScalar } from './graphql-scalars/object-id.scalar';

@Module({
  providers: [ObjectIdScalar],
})
export class CommonModule {}
