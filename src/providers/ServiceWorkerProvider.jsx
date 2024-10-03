import React, { useEffect } from "react";
import { useSnackbarContext } from "./SnackbarManager";

const ServiceWorkerProvider = ({ children }) => {
  const { showSnackbar } = useSnackbarContext();

  useEffect(() => {
    const handleServiceWorkerEvents = () => {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener("message", event => {
          console.log("ServiceWorkerProvider - message event received with data:", event.data);
          showSnackbar("...", "info");
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
