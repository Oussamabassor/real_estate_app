import React from 'react';

// or similar file that's showing the error message

// ...existing code...

// Update the network detection logic
const checkNetworkStatus = async () => {
  try {
    const response = await fetch('https://example.com', {
      method: 'GET',
      // Add cache control to prevent cached responses
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
      // Set a reasonable timeout
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      setIsOnline(true);
      setShowOfflineMessage(false);
    } else {
      setIsOnline(false);
      setShowOfflineMessage(true);
    }
  } catch (error) {
    console.error("Network check failed:", error);
    setIsOnline(false);
    setShowOfflineMessage(true);
  }
};

// ...existing code...
