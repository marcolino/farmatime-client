// components/SessionExpirationHandler.jsx
import { useContext, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../middlewares/Interceptors';
import { i18n } from "../i18n";
import { AuthContext } from '../providers/AuthContext';
import { useDialog } from "../providers/DialogContext";

const SessionExpirationHandler = ({ children }) => {
  const { signOut, isLoggedIn } = useContext(AuthContext);
  const { showDialog } = useDialog();
  const navigate = useNavigate();
  const expirationDialogRef = useRef(null);
  const mountedRef = useRef(false);

  const handleSessionExpiration = useCallback(async (response = {}) => {
    console.log("SessionExpirationHandler.handleSessionExpiration() called", response);
    
    // Prevent multiple dialogs
    if (expirationDialogRef.current) {
      console.log("Dialog already showing, skipping");
      return;
    }
    
    try {
      expirationDialogRef.current = true;
      
      // SIGN OUT FIRST
      console.log("Calling signOut...");
      await signOut();
      console.log("signOut completed");
      
      let message = response.message;
      if (!message || response.code === "EXPIRED_TOKEN") {
        //message = i18n.t("Your session is expired, to guarantee maximum security.\nPlease log in again")
        message =
          i18n.t("To keep your account secure, we automatically sign you out after a period of inactivity") +
          ".\n\n" +
          i18n.t("Please sign in again to continue where you left off") +
          "."
        ;
      }

      console.log("Showing dialog...");
      showDialog({
        title: i18n.t("Session Expired"),
        message,
        confirmText: i18n.t("Ok"),
        onConfirm: async () => {
          console.log("Dialog confirmed, navigating to signin");
          expirationDialogRef.current = null;
          navigate('/signin', { 
            replace: true, 
            state: { 
              reason: 'session_expired',
              message 
            } 
          });
        },
      });
      console.log("Dialog shown successfully");
    } catch (error) {
      console.error('Error showing session expiration dialog:', error);
      // Fallback
      await signOut();
      navigate('/signin', { replace: true });
    }
  }, [showDialog, signOut, navigate]);

  // Listen for localStorage changes in the SAME tab
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkLocalStorage = () => {
      const expired = localStorage.getItem('session_expired');
      if (expired) {
        console.log("SessionExpirationHandler: Found session_expired in localStorage");
        localStorage.removeItem('session_expired');
        handleSessionExpiration();
      }
    };
    const checkLocalStorage_NEW= () => {
    const expired = localStorage.getItem('session_expired');
    if (expired) {
      const expiryTime = parseInt(expired, 10);
      const now = Date.now();
      const maxAge = 60000; // Only handle expirations from the last 60 seconds
      
      // Only handle if it's a recent expiration
      if (now - expiryTime < maxAge) {
        console.log("SessionExpirationHandler: Found RECENT session_expired in localStorage");
        localStorage.removeItem('session_expired');
        handleSessionExpiration();
      } else {
        console.log("SessionExpirationHandler: Found STALE session_expired, clearing it");
        localStorage.removeItem('session_expired');
      }
    }
  };

  // Check periodically for localStorage changes
  const interval = setInterval(checkLocalStorage, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn, handleSessionExpiration]);

  // Handle storage events for CROSS-TAB communication
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleStorageChange = (event) => {
      console.log("SessionExpirationHandler: storage event", event.key, event.newValue);
      if (event.key === 'session_expired') {
        console.log("SessionExpirationHandler: processing session_expired from other tab");
        localStorage.removeItem('session_expired');
        handleSessionExpiration({ message: "Session expired in another tab" });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn, handleSessionExpiration]);

  // Handle API responses globally
  useEffect(() => {
    if (!isLoggedIn) return;

    const errorInterceptor = async (error) => {
      const { response } = error;
      
      if (response?.status === 401) {
        const { code, action, message } = response.data || {};
        
        console.log("SessionExpirationHandler: Caught 401 from API", { code, action, message });
        
        if (
          code === 'NO_TOKEN' ||
          code === 'NO_REFRESH_TOKEN' ||
          code === 'INVALID_REFRESH_TOKEN' ||
          action === 'SIGNOUT' ||
          code === 'SESSION_EXPIRED'
        ) {
          await handleSessionExpiration({ code, action, message });
        }
      }
      
      return Promise.reject(error);
    };

    const interceptor = instance.interceptors.response.use(
      (response) => response, 
      errorInterceptor
    );

    return () => {
      instance.interceptors.response.eject(interceptor);
    };
  }, [isLoggedIn, handleSessionExpiration]);

  // Prevent multiple mounts from causing issues
  useEffect(() => {
    if (mountedRef.current) {
      console.warn("SessionExpirationHandler mounted multiple times!");
    }
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return children;
};

export default SessionExpirationHandler;
