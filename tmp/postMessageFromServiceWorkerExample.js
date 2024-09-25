self.clients.matchAll().then(clients => {
  clients.forEach(client => {
    client.postMessage({
      type: 'SHOW_SNACKBAR',
      message: 'This is a message from the service worker!',
      variant: 'info'
    });
  });
});