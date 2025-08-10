'use client';

import type { PostHog } from 'posthog-js';
let posthogInstance: PostHog | null = null;

export async function initPostHog() {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  if (posthogInstance) return; // already initialized

  const { default: posthog } = await import('posthog-js');
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: (ph) => {
      posthogInstance = ph;
      if (process.env.NODE_ENV === 'development') ph.debug();
    },
  });
}

export async function trackEvent(event: string, properties?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  if (!posthogInstance) {
    try {
      const { default: posthog } = await import('posthog-js');
      posthogInstance = posthog;
    } catch {
      return;
    }
  }
  try {
    posthogInstance.capture(event, properties as Record<string, string | number | boolean>);
  } catch {}
}
