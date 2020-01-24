import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { SendMailResult } from './models/send-mail-result.model';

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
  ): Promise<SendMailResult> {
    const result = new SendMailResult();

    try {
      const msgResult = await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: mailTo,
        subject,
        text: body,
        html: htmlBody,
      });

      result.success = true;
      result.message = msgResult;
    } catch (error) {
      result.success = false;
      result.message = error;
    }

    return result;
  }
}
