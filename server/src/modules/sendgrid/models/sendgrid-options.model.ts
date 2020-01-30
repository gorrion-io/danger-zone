export class SendgridOptions {
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  readonly apiKey: string;
}
