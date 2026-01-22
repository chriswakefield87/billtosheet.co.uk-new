"use client";

import { sendSignal } from '@/lib/telemetry';

interface CheckoutButtonProps {
  packId: string;
  packName: string;
  credits: number;
  price: number;
  popular: boolean;
  userId: string | null;
}

export default function CheckoutButton({ 
  packId, 
  packName, 
  credits, 
  price, 
  popular, 
  userId 
}: CheckoutButtonProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Track CheckoutStarted before form submission
    await sendSignal('CheckoutStarted', {
      packId,
      packName,
      credits: credits.toString(),
      price: (price / 100).toString(), // Convert pence to pounds
    });
    
    // Form will submit normally after signal is sent
  };

  return (
    <form action="/api/checkout" method="POST" onSubmit={handleSubmit}>
      <input type="hidden" name="packId" value={packId} />
      <button
        type="submit"
        disabled={!userId}
        className={`w-full ${
          popular ? "btn-primary" : "btn-secondary"
        } ${!userId ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {userId ? "Purchase" : "Sign In to Purchase"}
      </button>
    </form>
  );
}
