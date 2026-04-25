/**
 * Sentry error monitoring initialization for server and edge runtimes.
 * Features:
 * - Server-side monitoring
 * - Edge runtime monitoring
 * - Environment detection
 *
 * Modified by Shaik Bhasidh (https://bhasidhshaik.dev) from auto-generated
 * code by Sentry CLI.
 */

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
