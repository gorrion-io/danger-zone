import { Module, DynamicModule, Global } from '@nestjs/common';
import { SendgridOptions } from './models/sendgrid-options.model';
import { SendgridService } from './sendgrid.service';

@Global()
@Module({
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {
  static forRoot(options: SendgridOptions): DynamicModule {
    return {
      module: SendgridModule,
      providers: [
        {
          provide: 'SendgridOptions',
          useValue: options,
        },
        SendgridService,
      ],
      exports: [SendgridService],
    };
  }
}
