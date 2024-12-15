// unregister service workers (THIS CODE SHOULD BE USED BY CLIENT RUNNING IN NAVIGATOR)

export const unregisterServiceWorkers = async () => {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let registration of registrations) {
      await registration.unregister();
    }
    console.log("All service workers unregistered");
  }
};

// usage during development
if (import.meta.env.DEV) {
  unregisterServiceWorkers();
}