import { Module } from '@nestjs/common';
import { ObjectIdScalar } from './graphql-scalars/object-id.scalar';
import { MailService } from './mail.service';

@Module({
  providers: [ObjectIdScalar, MailService],
  exports: [MailService],
})
export class CommonModule {}
