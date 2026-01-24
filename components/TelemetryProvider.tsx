"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { initTelemetryDeck, sendSignal } from '@/lib/telemetry';

// Helper to get referrer domain
function getReferrerDomain(referrer: string): string {
  if (!referrer) return 'direct';
  
  try {
    const url = new URL(referrer);
    const hostname = url.hostname;
    
    // Simplify common referrers
    if (hostname.includes('google.')) return 'google';
    if (hostname.includes('bing.')) return 'bing';
    if (hostname.includes('yahoo.')) return 'yahoo';
    if (hostname.includes('duckduckgo.')) return 'duckduckgo';
    if (hostname.includes('facebook.')) return 'facebook';
    if (hostname.includes('twitter.') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('linkedin.')) return 'linkedin';
    if (hostname.includes('reddit.')) return 'reddit';
    if (hostname.includes('youtube.')) return 'youtube';
    
    // Return the domain (without www)
    return hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

// Helper to get user's country
async function getUserCountry(): Promise<string | null> {
  try {
    // Try using ipapi.co free tier (no API key needed for basic country lookup)
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.country_code || data.country || null;
    }
  } catch (error) {
    console.debug('Failed to get country from ipapi.co:', error);
  }
  
  // Fallback: try ip-api.com (free tier, no API key needed)
  try {
    const response = await fetch('http://ip-api.com/json/?fields=countryCode', {
      method: 'GET',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.countryCode || null;
    }
  } catch (error) {
    console.debug('Failed to get country from ip-api.com:', error);
  }
  
  return null;
}

export default function TelemetryProvider() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const hasTrackedLandingPage = useRef(false);
  const countryFetched = useRef(false);

  useEffect(() => {
    // Initialize TelemetryDeck once
    if (isLoaded) {
      const userIdentifier = user?.emailAddresses[0]?.emailAddress || user?.id || 'anonymous';
      initTelemetryDeck(userIdentifier);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    // Fetch and track country once per session
    if (!countryFetched.current && typeof window !== 'undefined') {
      countryFetched.current = true;
      
      getUserCountry().then((country) => {
        if (country) {
          sendSignal('User.Country', {
            country: country,
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    // Track pageviews on route changes
    if (pathname && isLoaded) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        // Check if this is the first pageview in this session
        const sessionKey = 'telemetrydeck_landing_page_tracked';
        const hasTracked = sessionStorage.getItem(sessionKey);

        if (!hasTracked && pathname) {
          // Get referrer for landing page
          const referrer = typeof document !== 'undefined' ? document.referrer : '';
          const referrerDomain = getReferrerDomain(referrer);
          
          // Track landing page view (first page in session) with referrer
          sendSignal('LandingPageView', {
            path: pathname,
            referrer: referrerDomain,
            referrerFull: referrer || 'direct',
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
