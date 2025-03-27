// or similar file that might be registering a service worker

// ...existing code...

// Add a method to handle online status changes
self.addEventListener('online', () => {
  // When online, clear any offline indicators and refresh API data
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'CONNECTION_RESTORED'
      });
    });
  });
});

// ...existing code...
