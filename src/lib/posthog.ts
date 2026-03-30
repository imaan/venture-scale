import { PostHog } from 'posthog-node';

const isProduction = process.env.NODE_ENV === 'production';

export const posthog: PostHog | null = isProduction
  ? new PostHog(process.env.POSTHOG_PROJECT_TOKEN!, {
      host: 'https://eu.i.posthog.com',
      enableExceptionAutocapture: true,
    })
  : null;
