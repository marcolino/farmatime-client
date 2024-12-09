import { useRegisterSW } from "virtual:pwa-register/react";

export const useServiceWorker = () => {
  const {
    offlineReady,
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW();

  return { offlineReady, needRefresh, updateServiceWorker };
};
