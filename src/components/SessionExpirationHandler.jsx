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
    // Prevent multiple dialogs
    if (expirationDialogRef.current) { // Dialog already showing, skipping
      return;
    }
    
    try {
      expirationDialogRef.current = true;
      
      // sign out first
      await signOut();
      
      let message = response.message;
      if (!message || response.code === "EXPIRED_TOKEN") {
        message =
          i18n.t("To keep your account secure, we automatically sign you out after a period of inactivity") +
          ".\n\n" +
          i18n.t("Please sign in again to continue where you left off") +
          "."
        ;
      }

      showDialog({
        title: i18n.t("Session Expired"),
        message,
        confirmText: i18n.t("Ok"),
        onConfirm: async () => {
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
    } catch (error) {
      console.error('Error showing session expiration dialog:', error);
      // Fallback
      await signOut();
      navigate('/signin', { replace: true });
    }
  }, [showDialog, signOut, navigate]);

  /*
  // Listen for localStorage changes in the SAME tab
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkLocalStorage = () => {
      const expired = localStorage.getItem('session_expired');
      if (expired) {
        localStorage.removeItem('session_expired');
        handleSessionExpiration();
      }
    };

    // Check periodically for localStorage changes
    const interval = setInterval(checkLocalStorage, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn, handleSessionExpiration]);
  */
  
  // Handle storage events for CROSS-TAB communication
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleStorageChange = (event) => {
      if (event.key === 'session_expired') {
        localStorage.removeItem('session_expired');
        handleSessionExpiration();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn, handleSessionExpiration]);

  // Listen for sessionExpiredEvent events 
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const handleSessionExpiredEvent = () => {
      handleSessionExpiration();
    };

    window.addEventListener('sessionExpiredEvent', handleSessionExpiredEvent);
    
    return () => {
      window.removeEventListener('sessionExpiredEvent', handleSessionExpiredEvent);
    };
  }, [isLoggedIn, handleSessionExpiration]);
  
  // Handle API responses globally
  useEffect(() => {
    if (!isLoggedIn) return;

    const errorInterceptor = async (error) => {
      const { response } = error;
      
      if (response?.status === 401) {
        const { code, action, message } = response.data || {};
        
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
