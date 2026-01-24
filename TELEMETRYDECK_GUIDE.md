# TelemetryDeck Integration Guide

TelemetryDeck has been installed and configured for automatic pageview tracking. Here's how to use it for custom signals.

## ✅ What's Already Set Up

1. **Automatic Pageview Tracking** - Every page navigation is automatically tracked as a `PageView` signal with the path
2. **User Identification** - Users are automatically identified by their email (if logged in) or Clerk user ID
3. **Initialization** - TelemetryDeck is initialized in the `TelemetryProvider` component

## 📊 Sending Custom Signals

To send a custom signal anywhere in your app, import and use the `sendSignal` function:

```typescript
import { sendSignal } from '@/lib/telemetry';

// Simple signal (just the event name)
await sendSignal('Button.Click');

// Signal with custom data
await sendSignal('Purchase.Complete', {
  packId: 'pack_100',
  credits: '100',
  price: '19.00',
});
```

## 📝 Example Use Cases

### 1. Track Button Clicks
```typescript
import { sendSignal } from '@/lib/telemetry';

const handleClick = async () => {
  await sendSignal('Button.Pricing.Click');
  // ... your button logic
};
```

### 2. Track Form Submissions
```typescript
import { sendSignal } from '@/lib/telemetry';

const handleSubmit = async (formData) => {
  await sendSignal('Form.Contact.Submit', {
    hasMessage: formData.message ? 'true' : 'false',
  });
  // ... submit logic
};
```

### 3. Track Conversions (Already Added)
See `components/UploadTool.tsx` for examples:
- `Conversion.Success` - When a PDF conversion succeeds
- `Conversion.Error` - When a conversion fails

### 4. Track Purchases
```typescript
import { sendSignal } from '@/lib/telemetry';

// In your checkout success handler
await sendSignal('Purchase.Complete', {
  packId: pack.id,
  credits: pack.credits.toString(),
  price: (pack.price / 100).toString(), // Convert pence to pounds
});
```

### 5. Track Feature Usage
```typescript
import { sendSignal } from '@/lib/telemetry';

await sendSignal('Feature.Download.Excel', {
  conversionId: conversion.id,
});
```

## 🎯 Signal Naming Best Practices

- Use dot notation: `Category.Action` (e.g., `Purchase.Complete`, `Button.Click`)
- Be consistent with naming
- Use descriptive names
- Group related signals with the same prefix

## 📦 Signal Payload

- All values are converted to strings (except `floatValue`)
- Use `floatValue` for numeric values that need to be numbers
- Keep payloads small and meaningful

Example with float:
```typescript
await sendSignal('Volume.Set', {
  band: 'Spinal Tap',
  floatValue: 11.0,
});
```

## 🔍 Where Signals Are Sent

All signals are sent to your TelemetryDeck dashboard:
- App ID: `4A123EEC-8E34-4E83-BF22-F43D46500ECB`
- View at: https://telemetrydeck.com

## 📍 Current Implementation

- **Pageviews**: Automatically tracked on every route change
- **LandingPageView**: Fires once per session on the first page view (includes `path`, `referrer`, `referrerFull`)
- **User.Country**: Fires once per session with the user's country code (e.g., "GB", "US", "DE")
- **User Identification**: Uses email address (or Clerk user ID if no email)
- **Conversion Tracking**: Already added to `UploadTool.tsx`

### Referrer Tracking

The `LandingPageView` signal automatically includes referrer information:
- `referrer`: Simplified domain (e.g., "google", "facebook", "direct")
- `referrerFull`: Full referrer URL (or "direct" if no referrer)

Common referrer domains are simplified:
- `google`, `bing`, `yahoo`, `duckduckgo` for search engines
- `facebook`, `twitter`, `linkedin`, `reddit`, `youtube` for social media
- Other domains are shown as-is (without www prefix)
- `direct` for users who typed the URL or used a bookmark

### Country Tracking

The `User.Country` signal is sent once per session with the user's country code (ISO 3166-1 alpha-2 format, e.g., "GB", "US", "FR"). This uses a free IP geolocation service and may not be available in all cases (e.g., if the API is rate-limited or blocked).

## 🎯 Conversion Funnel Tracking

Three key conversion events are automatically tracked to help you measure your funnel:

### 1. SignupCompleted
- **When**: Fires when a new user completes signup and first visits the dashboard
- **Location**: `components/SignupTracker.tsx` (triggered from `app/dashboard/page.tsx`)
- **Payload**: None (just the event name)
- **Use Case**: Track how many users complete the signup process

### 2. CheckoutStarted
- **When**: Fires when a user clicks "Purchase" on any credit pack
- **Location**: `components/CheckoutButton.tsx`
- **Payload**:
  - `packId`: The ID of the credit pack (e.g., "pack_100")
  - `packName`: The name of the pack (e.g., "Starter Pack")
  - `credits`: Number of credits in the pack
  - `price`: Price in pounds (e.g., "19.00")
- **Use Case**: Track how many users start the checkout process

### 3. PaidStarted
- **When**: Fires when a user returns to the dashboard after successful payment
- **Location**: `components/SignupTracker.tsx` (triggered when `?success=true` query param is present)
- **Payload**: None (just the event name)
- **Use Case**: Track how many users complete a purchase

### Funnel Analysis
You can now track the complete conversion funnel:
1. **SignupCompleted** → Users who sign up
2. **CheckoutStarted** → Users who click purchase
3. **PaidStarted** → Users who complete payment

This lets you identify drop-off points in your conversion funnel.

## 🚀 Quick Reference

```typescript
// Import
import { sendSignal } from '@/lib/telemetry';

// Send simple signal
await sendSignal('Event.Name');

// Send signal with data
await sendSignal('Event.Name', {
  key1: 'value1',
  key2: 'value2',
  floatValue: 123.45, // For numeric values
});
```

That's it! Just import and use `sendSignal` wherever you need to track custom events.
