import TelemetryDeck from '@telemetrydeck/sdk';

// Initialize TelemetryDeck client
// This will be initialized in the browser with user info
let tdInstance: TelemetryDeck | null = null;

export function initTelemetryDeck(userIdentifier?: string) {
  if (typeof window === 'undefined') {
    // Server-side: return null
    return null;
  }

  if (tdInstance) {
    // Update user if provided
    if (userIdentifier) {
      tdInstance.clientUser = userIdentifier;
    }
    return tdInstance;
  }

  // Initialize with app ID and user identifier
  tdInstance = new TelemetryDeck({
    appID: '4A123EEC-8E34-4E83-BF22-F43D46500ECB',
    clientUser: userIdentifier || 'anonymous',
  });

  return tdInstance;
}

export function getTelemetryDeck(): TelemetryDeck | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return tdInstance;
}

// Helper function to send custom signals
export async function sendSignal(signalType: string, payload?: Record<string, any>) {
  const td = getTelemetryDeck();
  if (!td) {
    console.warn('TelemetryDeck not initialized');
    return;
  }

  try {
    if (payload) {
      await td.signal(signalType, payload);
    } else {
      await td.signal(signalType);
    }
  } catch (error) {
    console.error('Failed to send TelemetryDeck signal:', error);
  }
}
