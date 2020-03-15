import { PubSub } from 'apollo-server-express';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'PUB_SUB',
      useClass: PubSub,
    },
  ],
  exports: ['PUB_SUB'],
})
export class PubSubModule {}
