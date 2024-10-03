// ServiceWorkerProvider.js
import React, { useEffect, useContext } from "react";
import { SnackbarContext } from "./SnackbarProviderWrapper";

const ServiceWorkerProvider = ({ children }) => {
  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    const handleServiceWorkerEvents = () => {
      // service worker logic, e.g., detecting offline mode
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener("message", event => {
          if (event.data === "offline") {
            showSnackbar("You are offline", { variant: "warning" });
          } else if (event.data === "online") {
            showSnackbar("You are back online", { variant: "success" });
          }
        });
      }
    };

    handleServiceWorkerEvents();

    return () => {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener("message", handleServiceWorkerEvents);
      }
    };
  }, [showSnackbar]);

  return <>{children}</>;
};

export default ServiceWorkerProvider;
