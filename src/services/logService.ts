import * as Sentry from "@sentry/react";


const logService = () => {
  const sentry_dsn: string | undefined = import.meta.env.VITE_REACT_APP_SENTRY_DSN as string | undefined
    Sentry.init({
        dsn: sentry_dsn,
        integrations: [
          new Sentry.BrowserTracing({
            // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
            tracePropagationTargets: ["localhost", "https://navcraftapp.com", /^https:\/\/navcraftapi\.com\/api/, /^https:\/\/navbrixapi\.com\/api/],
          }),
          new Sentry.Replay(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      });
}

export default logService