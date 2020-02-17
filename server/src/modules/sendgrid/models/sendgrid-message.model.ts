export class SendgridMessage {
  to: string | string[];
  from: string;
  subject: string;
  text: string;
  html: string;
}
