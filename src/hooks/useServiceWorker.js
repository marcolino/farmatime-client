import { useState, useCallback } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export const useServiceWorker = () => {
  const [offlineReadyVisible, setOfflineReadyVisible] = useState(false);
  const [needRefreshVisible, setNeedRefreshVisible] = useState(false);

  const {
    offlineReady,
    needRefresh,
    updateServiceWorker: originalUpdateServiceWorker,
  } = useRegisterSW({
    onOfflineReady: () => setOfflineReadyVisible(true),
    onNeedRefresh: () => setNeedRefreshVisible(true),
  });

  const updateServiceWorker = useCallback(async () => {
    await originalUpdateServiceWorker();
    setOfflineReadyVisible(false); // clear offlineReady notification
    setNeedRefreshVisible(false); // clear needRefresh notification
  }, [originalUpdateServiceWorker]);

  return {
    offlineReady: offlineReady && offlineReadyVisible,
    needRefresh: needRefresh && needRefreshVisible,
    updateServiceWorker,
  };
};
