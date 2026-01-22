"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { initTelemetryDeck, sendSignal } from '@/lib/telemetry';

export default function TelemetryProvider() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const hasTrackedLandingPage = useRef(false);

  useEffect(() => {
    // Initialize TelemetryDeck once
    if (isLoaded) {
      const userIdentifier = user?.emailAddresses[0]?.emailAddress || user?.id || 'anonymous';
      initTelemetryDeck(userIdentifier);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    // Track pageviews on route changes
    if (pathname && isLoaded) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        // Check if this is the first pageview in this session
        const sessionKey = 'telemetrydeck_landing_page_tracked';
        const hasTracked = sessionStorage.getItem(sessionKey);

        if (!hasTracked && pathname) {
          // Track landing page view (first page in session)
          sendSignal('LandingPageView', {
            path: pathname,
          });
          sessionStorage.setItem(sessionKey, 'true');
          hasTrackedLandingPage.current = true;
        }

        // Always track regular pageview
        sendSignal('PageView', {
          path: pathname,
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname, isLoaded]);

  return null; // This component doesn't render anything
}
