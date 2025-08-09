export interface EmailPayload { to: string; subject: string; html: string }
export interface EmailProvider { send(payload: EmailPayload): Promise<{ id?: string }>; }

export class ResendProvider implements EmailProvider {
  constructor(private apiKey: string) {}
  async send(payload: EmailPayload) {
    const { Resend } = await import('resend');
    const client = new Resend(this.apiKey);
    const res = await client.emails.send({ from: 'no-reply@miskre.com', ...payload });
    return { id: (res as any)?.id };
  }
}

