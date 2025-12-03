import { useState, useEffect, useCallback, useRef } from "react";
import { AuthContext } from "./AuthContext";
//import { useNavigate } from "react-router-dom";
import { usePersistedState } from "../hooks/usePersistedState";
import { apiCall } from "../libs/Network";
import config from "../config";

const initialStateUser = { user: null };
const initialStatePreferences = {
  locale: config.serverLocale,
  theme: config.ui.defaultTheme
};

const AuthProvider = (props) => {
  const [auth, setAuth] = usePersistedState("auth", initialStateUser);
  const [guest, setGuest] = usePersistedState("guest", initialStateUser);
  const isLoggedIn = !!auth.user;
  const didSignInBefore = auth.user !== null;
  const [preferences, setPreferences] = useState(isLoggedIn ? auth.user?.preferences : initialStatePreferences);
  const isPWAInstalled = isLoggedIn ? auth.user?.isPWAInstalled === true : false;
  const sessionTimerRef = useRef(null);
  const signOutInProgress = useRef(false);

  const clearSessionTimer = useCallback(() => {
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  }, []);

  const signOut = useCallback(async (/*reason = "user_action"*/) => {
     // Prevent multiple simultaneous signouts
    if (signOutInProgress.current) return true;
    signOutInProgress.current = true;

    try {
      clearSessionTimer(); // Clear timer immediately to prevent race conditions
        
      if (isLoggedIn) {
        try {
          const result = await apiCall("post", "/auth/signout", {
            userId: auth.user.id
          });
          if (result.err && result.code !== "EXPIRED_TOKEN") {
            console.error("sign out on server error:", result.message);
          } else {
            //console.info("sign out on server successful", result);
          }
        } catch (err) {
          console.error("sign out on server exception:", err.message);
        }
      }

      // Clear local state
      setAuth({ user: false });
      setPreferences(guest.preferences);

      localStorage.setItem('session_expired', Date.now()); // Notify other tabs

      //console.info(`sign out completed (reason: ${reason})`);
      return true;
    } catch (err) {
      console.error("sign out exception:", err.message);
      return false;
    } finally {
      signOutInProgress.current = false;
    }
  }, [auth.user, clearSessionTimer, setAuth, isLoggedIn, guest.preferences]);

  // Handle session expiration with events
  const handleSessionExpired = useCallback(() => {
    // Dispatch a custom event instead of using localStorage
    window.dispatchEvent(new CustomEvent('sessionExpiredEvent'));
  }, []);

  // Starts session expiration timer
  const startSessionTimer = useCallback((expiresAt) => {
    clearSessionTimer();
    if (!expiresAt) return;

    const msUntilExpiry = new Date(expiresAt).getTime() - Date.now();
    
    if (msUntilExpiry > 0) { // Not expired yet
      sessionTimerRef.current = setTimeout(() => {
        handleSessionExpired();
      }, msUntilExpiry);
    } else { // Already expired
      handleSessionExpired();
    }
  }, [clearSessionTimer, handleSessionExpired]);

  // Clear any stale session flags when app starts
  useEffect(() => {
    localStorage.removeItem('session_expired');
  }, []);
  
  /**
   * API + user preference helpers
   */
  const updateUserPreferences = useCallback(async (user, preferences) => {
    try {
      const result = await apiCall("post", "/user/updateUser", {
        _id: user.id,
        preferences
      });
      if (result.err) console.error("update user error:", result.err);
      // else console.log("update user successful", result);
    } catch (error) {
      console.error("update user error:", error);
    }
  }, []);

  /**
   *  Auth core actions
   */
  const signIn = useCallback(
    async (user) => {
      if (!user) {
        console.warn("AuthProvider.signIn: no user, skipping");
        return false;
      }
      if (auth.user && auth.user.id === user.id) {
        console.warn("AuthProvider.signIn: same user, skipping");
        return false;
      }
      // console.log("AuthProvider.signIn, user:", user);
      setAuth({ user });
      if (user?.preferences) {
        setPreferences(user.preferences);
      }
      if (user?.refreshTokenExpiresAt) {
        startSessionTimer(user.refreshTokenExpiresAt);
      }

      return true; // signal a real change
    },
    [auth.user, setAuth, setPreferences, startSessionTimer]
  );

  const updateSignedInUserPreferences = async (user) => {
    setAuth({ user });
    if (user && user.preferences) {
      setPreferences(user.preferences);
    }
    };
  
  const revoke = useCallback(async () => {
    let ok = false;
    if (auth.user !== null) {
      clearSessionTimer();
      setAuth({ user: null });
      // console.log("Setting auth to", { user: null });
      setPreferences(guest.preferences);
      ok = true;
    } else {
      console.warn("already revoked");
    }
    return ok;
  }, [auth.user, clearSessionTimer, setAuth, guest.preferences]);

  /**
   *  Preferences + UI updates
   */
  const changeLocale = useCallback(
    (locale) => {
      const newPreferences = { ...preferences, locale };
      setPreferences(newPreferences);

      if (isLoggedIn && auth.user) {
        setAuth({
          user: {
            ...auth.user,
            preferences: newPreferences
          }
        });
        updateUserPreferences(auth.user, newPreferences);
      } else {
        setGuest({
          user: { preferences: newPreferences }
        });
      }
    },
    [
      preferences,
      setPreferences,
      updateUserPreferences,
      setAuth,
      setGuest,
      isLoggedIn,
      auth.user
    ]
  );

  const toggleTheme = useCallback(() => {
    const newPreferences = {
      ...preferences,
      theme: preferences.theme === "light" ? "dark" : "light"
    };
    setPreferences(newPreferences);

    if (isLoggedIn && auth.user) {
      setAuth({
        user: {
          ...auth.user,
          preferences: newPreferences
        }
      });
      updateUserPreferences(auth.user, newPreferences);
    } else {
      setGuest({
        user: {
          ...guest.user,
          preferences: newPreferences
        }
      });
    }
  }, [
    preferences,
    setPreferences,
    updateUserPreferences,
    setAuth,
    setGuest,
    isLoggedIn,
    auth.user,
    guest.user
  ]);

  const cloneGuestUserPreferencesToAuthUser = useCallback(
    (user) => {
      if (guest.user?.preferences) {
        const guestPreferences = guest.user.preferences;
        const newUser = { ...user, preferences: guestPreferences };
        setAuth({ user: newUser });
      }
    },
    [guest.user, setAuth]
  );

  const updateSignedInUserLocally = useCallback(
    (updatedFields) => {
      setAuth((prevAuth) => ({
        user: {
          ...prevAuth.user,
          ...updatedFields
        }
      }));
    },
    [setAuth]
  );

  const setPWAInstalled = useCallback(
    (how) => {
      if (auth.user) {
        setAuth({
          user: {
            ...auth.user,
            PWAInstalled: how
          }
        });
      }
    },
    [auth.user, setAuth]
  );

  /**
   *  Effects
   */
  useEffect(() => {
    if (auth.user?.refreshTokenExpiresAt) {
      startSessionTimer(auth.user.refreshTokenExpiresAt);
    }
    return () => clearSessionTimer();
  }, [auth.user?.refreshTokenExpiresAt, startSessionTimer, clearSessionTimer]);

  /**
   *  Render
   */
  return (
    <AuthContext.Provider
      value={{
        auth,
        guest,
        preferences,
        isLoggedIn,
        didSignInBefore,
        signIn,
        updateSignedInUserPreferences,
        signOut,
        revoke,
        changeLocale,
        toggleTheme,
        cloneGuestUserPreferencesToAuthUser,
        updateSignedInUserLocally,
        isPWAInstalled,
        setPWAInstalled
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
