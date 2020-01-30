import { Injectable, Inject } from '@nestjs/common';
import { SendgridOptions } from './models/sendgrid-options.model';
import * as sgMail from '@sendgrid/mail';
import { MailData } from '@sendgrid/helpers/classes/mail';
import { SendgridMessage } from './models/sendgrid-message.model';
import { SuccessResponse } from '../common/graphql-generic-responses/success-response.model';
import { ErrorResponse } from '../common/graphql-generic-responses/error-response.model';

@Injectable()
export class SendgridService {
  constructor(
    @Inject('SendgridOptions')
    private readonly sendgridOptions: SendgridOptions,
  ) {
    sgMail.setApiKey(this.sendgridOptions.apiKey);
  }

  send(message: SendgridMessage): Promise<SuccessResponse | ErrorResponse> {
    return new Promise(resolve => {
      const handleSGResponse = (err, res) => {
        if (err) {
          resolve(
            new ErrorResponse(`Something went wrong while sengin email!`),
          );
          // TODO logger stuff
        } else {
          resolve(new SuccessResponse(`Email has been sent.`));
        }
      };

      if (Array.isArray(message.to)) {
        const messages: MailData[] = message.to.map(t => {
          const { to, ...msg } = message;
          return { to: t, ...msg };
        });

        sgMail.send(messages, true, (err, result) =>
          handleSGResponse(err, result),
        );
      } else {
        sgMail.send(message, false, (err, result) =>
          handleSGResponse(err, result),
        );
      }
    });
  }
}
