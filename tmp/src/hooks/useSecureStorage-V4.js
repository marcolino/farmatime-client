import { useState, useEffect, useRef, useCallback } from "react";
import { SecureStorage } from "../libs/SecureStorage";

export const useSecureStorage = () => {
  const [secureStorageStatus, setSecureStorageStatus] = useState('initializing'); // 'initializing' | 'ready' | 'error'
  const secureStorageRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const instance = new SecureStorage('local');
        await instance.init();
        secureStorageRef.current = instance;
        setSecureStorageStatus('ready');
      } catch (err) {
        setSecureStorageStatus('error');
        console.error('SecureStorage initialization failed:', err);
      }
    })();
  }, []);

  const secureStorageSet = useCallback(async (key, value) => {
    if (secureStorageStatus !== 'ready') {
      throw new Error("SecureStorage not ready");
    }
    console.log("£££££££ secureStorageRef.current.set(key, value)", key, value);
    return secureStorageRef.current.set(key, value);
  }, [secureStorageStatus]);

  const secureStorageGet = useCallback(async (key) => {
    if (secureStorageStatus !== 'ready') {
      throw new Error("SecureStorage not ready");
    }
    return secureStorageRef.current.get(key);
  }, [secureStorageStatus]);

  return {
    secureStorageStatus,
    secureStorageSet,
    secureStorageGet,
  };
};
