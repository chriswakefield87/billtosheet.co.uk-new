"use client";

import { useEffect } from "react";
import { trackError, getErrorMessage, getErrorStack } from "@/lib/analytics-errors";

/**
 * Sets up global error handlers to track unhandled errors and promise rejections
 * in Google Analytics. Must run only on client.
 */
export default function ErrorTrackingProvider() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError({
        error_message: event.message || "Unknown error",
        error_type: "unhandled",
        source: event.filename || "unknown",
        stack: event.error instanceof Error ? event.error.stack : undefined,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError({
        error_message: getErrorMessage(event.reason),
        error_type: "unhandled_rejection",
        source: "promise",
        stack: getErrorStack(event.reason),
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
