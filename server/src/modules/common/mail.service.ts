import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { SuccessResponse } from './graphql-generic-responses/success-response.model';
import { ErrorResponse } from './graphql-generic-responses/error-response.model';

@Injectable()
export class MailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(
    mailTo: string,
    subject: string,
    body?: string,
    htmlBody?: string,
  ): Promise<SuccessResponse | ErrorResponse> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: mailTo,
        subject,
        text: body,
        html: htmlBody,
      });

      return new SuccessResponse('Email has been sent.');
    } catch (error) {
      // TODO logger
      return new ErrorResponse('Something went wrong while sending email.');
    }
  }
}
