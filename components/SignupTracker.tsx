"use client";

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { sendSignal } from '@/lib/telemetry';

interface SignupTrackerProps {
  isNewSignup?: boolean;
}

export default function SignupTracker({ isNewSignup = false }: SignupTrackerProps) {
  const searchParams = useSearchParams();
  const hasTrackedSignup = useRef(false);
  const hasTrackedPayment = useRef(false);

  useEffect(() => {
    // Track SignupCompleted - when a new user first visits the dashboard
    if (isNewSignup && !hasTrackedSignup.current) {
      const sessionKey = 'telemetrydeck_signup_tracked';
      const hasTracked = sessionStorage.getItem(sessionKey);
      
      if (!hasTracked) {
        sendSignal('SignupCompleted');
        sessionStorage.setItem(sessionKey, 'true');
        hasTrackedSignup.current = true;
      }
    }

    // Track PaidStarted - when user returns from successful payment
    const success = searchParams.get('success');
    if (success === 'true' && !hasTrackedPayment.current) {
      sendSignal('PaidStarted');
      hasTrackedPayment.current = true;
    }
  }, [searchParams, isNewSignup]);

  return null;
}
