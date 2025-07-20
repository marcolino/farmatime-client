import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { SecureStorage } from "../libs/SecureStorage";
import { AuthContext } from "../providers/AuthContext";

export const useSecureStorage = () => {
  const [secureStorageStatus, setSecureStorageStatus] = useState({ status: 'initializing' });
  const secureStorageRef = useRef(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const instance = new SecureStorage('local');
        await instance.init();
        secureStorageRef.current = instance;
        setSecureStorageStatus({ status: 'ready' });
      } catch (err) {
        setSecureStorageStatus({ status: 'error', error: err.message, code: err.code });
        console.error('SecureStorage initialization failed:', err);
      }
    })();
  }, [auth?.user?.id]);

  const secureStorageSet = useCallback(async (userId/*key*/, value) => {
    if (secureStorageStatus.error) {
      throw new Error(secureStorageStatus.error);
    }
    if (secureStorageStatus.status !== 'ready') {
      throw new Error("SecureStorage not ready");
    }
    const key = secureStorageRef.current.getSecureStorageKey(userId);
    return secureStorageRef.current.set(key, value);
  }, [secureStorageStatus]);

  const secureStorageGet = useCallback(async (userId/*key*/) => {
    if (secureStorageStatus.error) {
      throw new Error(secureStorageStatus.error);
    }
    if (secureStorageStatus.status !== 'ready') {
      throw new Error("SecureStorage not ready");
    }
    const key = secureStorageRef.current.getSecureStorageKey(userId);
    return secureStorageRef.current.get(key);
  }, [secureStorageStatus]);

  const secureStorageEncrypt = useCallback(async (value) => {
    if (secureStorageStatus.error) {
      throw new Error(secureStorageStatus.error);
    }
    if (secureStorageStatus.status !== 'ready') {
      throw new Error("SecureStorage not ready");
    }
    return secureStorageRef.current.encrypt(value);
  }, [secureStorageStatus]);

  const secureStorageDecrypt = useCallback(async (encryptedObject) => {
    if (secureStorageStatus.error) {
      throw new Error(secureStorageStatus.error);
    }
    if (secureStorageStatus.status !== 'ready') {
      throw new Error("SecureStorage not ready");
    }
    return secureStorageRef.current.decrypt(encryptedObject);
  }, [secureStorageStatus]);

  const secureStorageRemove = useCallback(async (userId/*key*/) => {
    if (secureStorageStatus.error) {
      throw new Error(secureStorageStatus.error);
    }
    if (secureStorageStatus.status !== 'ready') {
      throw new Error("SecureStorage not ready");
    }
    const key = secureStorageRef.current.getSecureStorageKey(userId);
    return secureStorageRef.current.remove(key);
  }, [secureStorageStatus]);

  return {
    secureStorageStatus,
    secureStorageSet,
    secureStorageGet,
    secureStorageRemove,
    secureStorageEncrypt,
    secureStorageDecrypt,
  };
};
