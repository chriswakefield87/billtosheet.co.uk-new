/**
 * Google Analytics error tracking utility.
 * Sends custom events to GA4 when errors occur, with error details as parameters.
 * GA4 parameter values are limited to 500 characters - we truncate accordingly.
 */

const MAX_PARAM_LENGTH = 500;

function truncate(value: string, max = MAX_PARAM_LENGTH): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 3) + '...';
}

export interface ErrorTrackingParams {
  /** Human-readable error message */
  error_message: string;
  /** Category/type of error (e.g. conversion, contact_form, api, unhandled) */
  error_type: string;
  /** Source/component where error occurred */
  source?: string;
  /** HTTP status code if from API response */
  status_code?: number;
  /** Truncated stack trace for debugging */
  stack?: string;
}

/**
 * Track an error in Google Analytics.
 * Call from catch blocks or when displaying errors to users.
 * Safe to call on server (no-op); only runs in browser when gtag is available.
 */
export function trackError(params: ErrorTrackingParams): void {
  if (typeof window === 'undefined') return;

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;

  const safeParams: Record<string, string | number> = {
    error_message: truncate(params.error_message),
    error_type: params.error_type,
  };

  if (params.source) {
    safeParams.source = truncate(params.source);
  }
  if (params.status_code !== undefined) {
    safeParams.status_code = params.status_code;
  }
  if (params.stack) {
    safeParams.stack = truncate(params.stack);
  }
  // Include current URL for context
  safeParams.page_url = truncate(window.location.href);

  gtag('event', 'app_error', safeParams);
}

/**
 * Extract error message from unknown error (Error, string, or other).
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return String(err);
}

/**
 * Extract stack trace from Error if available.
 */
export function getErrorStack(err: unknown): string | undefined {
  if (err instanceof Error && err.stack) return err.stack;
  return undefined;
}
