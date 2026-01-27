"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PurchaseTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if this is a successful purchase redirect
    const success = searchParams.get("success");
    
    if (success === "true") {
      // Track purchase completion
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "credits_purchase_completed");
      }
      
      // Clean up URL by removing the success parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return null;
}
