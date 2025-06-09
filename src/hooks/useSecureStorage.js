import { useState, useEffect, useRef, useCallback } from "react";
import { SecureStorage } from "../libs/SecureStorage";

export const useSecureStorage = () => {
  const [secureStorageStatus, setSecureStorageStatus] = useState('initializing'); // 'initializing' | 'ready' | 'error'
  const secureStorageRef = useRef(null);

  useEffect(() => {
    const initStorage = async () => {
      try {
        const instance = new SecureStorage('local');
        await instance.init();
        setSecureStorageStatus('ready');
        secureStorageRef.current = instance;
      } catch (err) {
        setSecureStorageStatus('error')
        console.error('SecureStorage initialization failed:', err);
      }
    };

    initStorage();

    return () => { }; // cleanup function
  }, []);

  return {
    secureStorageStatus,
    secureStorageSet: useCallback(async (key, value) => {
      if (secureStorageStatus !== 'ready') {
        throw new Error("SecureStorage not ready");
      }
      return secureStorageRef.current.set(key, value);
    }, [secureStorageRef, secureStorageStatus]),
    secureStorageGet: useCallback(async (key) => {
      if (secureStorageStatus !== 'ready') {
        throw new Error("SecureStorage not ready");
      }
      return secureStorageRef.current.get(key);
    }, [secureStorageRef, secureStorageStatus]),
  };
}
