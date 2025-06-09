import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { SecureStorage } from "../libs/SecureStorage";
import { AuthContext } from "../providers/AuthProvider";

export const useSecureStorage = () => {
  const [secureStorageStatus, setSecureStorageStatus] = useState('initializing'); // 'initializing' | 'ready' | 'error'
  const secureStorageRef = useRef(null);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    /*const initStorage = async () => {
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
    */
    (async () => {
      try {
        if (!isLoggedIn) { // Check if user is logged in
          setSecureStorageStatus('error');
          //throw new Error("User must be logged in to use SecureStorage init");
          //console.warn("User must be logged in to use SecureStorage init");
          return;
        }
        const instance = new SecureStorage('local');
        await instance.init();
        setSecureStorageStatus('ready');
        secureStorageRef.current = instance;
      } catch (err) {
        setSecureStorageStatus('error');
        console.error('SecureStorage initialization failed:', err);
      }
    })();

    return () => { }; // cleanup function
  }, []);

  return {
    secureStorageStatus,
    secureStorageSet: useCallback(async (key, value) => {
      if (secureStorageStatus !== 'ready') { // Check if status is ready
        throw new Error("SecureStorage not ready");
      }
      if (!isLoggedIn) { // Check if user is logged in
        //throw new Error("User must be logged in to use SecureStorage set");
        console.warn("User must be logged in to use SecureStorage set");
      }
      return secureStorageRef.current.set(key, value);
    }, [secureStorageRef, secureStorageStatus, isLoggedIn]),
    secureStorageGet: useCallback(async (key) => {
      if (secureStorageStatus !== 'ready') { // Check if status is ready
        throw new Error("SecureStorage not ready");
      }
      if (!isLoggedIn) { // Check if user is logged in
        //throw new Error("User must be logged in to use SecureStorage get");
        console.warn("User must be logged in to use SecureStorage get");
      }
      return secureStorageRef.current.get(key);
    }, [secureStorageRef, secureStorageStatus, isLoggedIn]),
  };
}
