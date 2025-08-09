import { ResendProvider } from './email';
import { StripeProvider, CODProvider } from './payments';

export function makeEmail(provider: string) {
  switch (provider) {
    case 'resend':
      return new ResendProvider(process.env.RESEND_API_KEY!);
    default:
      throw new Error('Unsupported email provider');
  }
}

export function makePayments(provider: string) {
  switch (provider) {
    case 'stripe':
      return new StripeProvider(process.env.STRIPE_API_KEY!);
    case 'cod':
      return new CODProvider();
    default:
      throw new Error('Unsupported payment provider');
  }
}

