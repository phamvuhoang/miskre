'use client';
import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
    });
  }
}

export function trackEvent(event: string, properties?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined') {
    posthog.capture(event, properties as Record<string, string | number | boolean>);
  }
}

export { posthog };
