import { useState, useEffect, /*useContext, */useCallback, useRef } from "react";
import { AuthContext } from "./AuthContext";
//import { JobContext } from "./JobContext";
import { useNavigate } from "react-router-dom";
import { useSnackbarContext } from "./SnackbarProvider";
//import DialogConfirm from './DialogConfirm';
import { usePersistedState } from "../hooks/usePersistedState";
import { apiCall } from "../libs/Network";
import LocalStorage from "../libs/LocalStorage";
import config from "../config";

const initialStateUser = { user: null }; // initial state for user, when app if first loaded
const initialStatePreferences = { locale: config.serverLocale, theme: config.ui.defaultTheme }; // initial state for locale and theme preferences (used for guest users only), when app if first loaded

// Module-level variable for global access
let globalSignOut = null;
/* eslint-disable-next-line react-refresh/only-export-components */
export const getGlobalSignOut = () => globalSignOut;

const AuthProvider = (props) => {
  const [auth, setAuth] = usePersistedState("auth", initialStateUser);
  const [guest, setGuest] = usePersistedState("guest", initialStateUser);
  const isLoggedIn = (!!auth.user);
  const didSignInBefore = (auth.user !== null);
  const [preferences, setPreferences] = useState(isLoggedIn ? auth.user?.preferences : initialStatePreferences);
  const isPWAInstalled = isLoggedIn ? (auth.user.isPWAInstalled === true) : false;
  const requestErrors = useState(isLoggedIn ? auth.user?.requestErrors : false);
  //const { resetJobs } = useContext(JobContext);
  const { showSnackbar } = useSnackbarContext();
  const sessionTimerRef = useRef(null);
  const navigate = useNavigate();

  // Start session timer
  const startSessionTimer = useCallback((expiresAt) => {
    clearSessionTimer();
    if (!expiresAt) return;

    const msUntilExpiry = new Date(expiresAt).getTime() - Date.now();
    if (msUntilExpiry > 0) {
      sessionTimerRef.current = setTimeout(() => {
        console.warn("Session expired (timer)");
        signOut("expired"); // call signOut with reason
        navigate("/signin", { replace: true, state: { reason: "expired" } });
      }, msUntilExpiry);
    }
  }, []);

  const updateUserPreferences = useCallback(async (user, preferences) => {
    try {
      const result = await apiCall("post", "/user/updateUser", { _id: user.id, /*email: auth.user.email,*/ preferences });
      if (result.err) {
        console.error("update user error:", result.err);
      } else {
        console.log("update user successful", result);
      }
    } catch (error) {
      console.error("update user error:", error);
    }
  }, []);

  // centralized sign in function
  const signIn = useCallback(async (user) => {
    console.log("AuthProvider signIn, user:", user);
    setAuth({ user });
    if (user?.preferences) { // user can be a user object or null, if login was unsuccessful
      //updateUserPreferences(user, user.preferences);
      setPreferences(user.preferences);
    }
    if (user?.refreshTokenExpiresAt) {
      startSessionTimer(user.refreshTokenExpiresAt);
    }
  }, [setAuth, setPreferences, startSessionTimer]);

  const updateSignedInUserPreferences = async (user) => {
    console.log("AuthProvider updateSignedInUserPreferences, user:", user);
    setAuth({ user });
    if (user && user.preferences) {
      setPreferences(user.preferences);
    }
  };

  const changeLocale = useCallback((locale) => {
    console.log("AuthProvider changeLocale, user:", auth.user, ", locale:", locale);
    const newPreferences = {
      ...preferences,
      locale,
    };

    setPreferences(newPreferences);

    if (isLoggedIn && auth.user) { // user is logged in, update auth.user.preferences.locale
      setAuth({ user: {
        ...auth.user,
        preferences: newPreferences,
      }});
      updateUserPreferences(auth.user, newPreferences);
    } else { // user is not logged in, update guest.user.preferences.locale
      setGuest({ user: {
        preferences: newPreferences,
      }});
    }
    //i18n.changeLanguage(locale);
  }, [preferences, setPreferences, updateUserPreferences, setAuth, setGuest, isLoggedIn, auth.user]);

  const toggleTheme = useCallback(async () => {
    const newPreferences = {
      ...preferences,
      theme: preferences.theme === "light" ? "dark" : "light", // update the theme
    };

    setPreferences(newPreferences);

    if (isLoggedIn && auth.user) { // user is logged in, update auth.user.preferences.theme
      setAuth({ user: {
        ...auth.user,
        preferences: newPreferences,
      }});
      updateUserPreferences(auth.user, newPreferences);
    } else { // user is not logged in, update guest.user.preferences.theme
      setGuest({
        user: {
        ...guest.user,
        preferences: newPreferences,
      }});
    }
  }, [preferences, setPreferences, updateUserPreferences, setAuth, setGuest, isLoggedIn, auth.user, guest.user]);

  // function to be called on successful signup, to avoid loosing guest user preferences
  const cloneGuestUserPreferencesToAuthUserOnSignup = async (user) => {
    if (guest.user?.preferences) {
      const guestPreferences = guest.user?.preferences;
      const newUser = { ...user, preferences: guestPreferences };
      setAuth({ user: newUser });
      //setGuest({ user: null });
      //alert("cloned guest user preferences to auth user: " + JSON.stringify(newUser));
    }
  };

  // centralized sign out function
  const signOut = useCallback(async (reason) => {
    let ok = false;
    if (isLoggedIn) {
      try {
        const result = await apiCall("post", "/auth/signout", { userId: auth.user.id });
        if (result.err) {
          // do not even show error to user, signout is also completed only client side
          console.error("sign out error:", result.err);
        } else {
          ok = true
          console.log("sign out successful", result);
        }
      } catch (error) {
        console.error("sign out error:", error);
      }
      clearSessionTimer();
      setAuth({ user: false }); // user is not set, but not null, it means she has an account
      setPreferences(guest.preferences);
    } else {
      console.warn("already signed out");
    }

    return ok;
  }, [auth.user, setAuth, guest.preferences, showSnackbar]);

  const revoke = useCallback(async () => {
    let ok = false;
    if (auth.user !== null) {
      clearSessionTimer();
      setAuth({ user: null }); // user is not set, and null, it means she had an account, but did revoke it
      console.log("Setting auth to", { user: null });
      setPreferences(guest.preferences);
      ok = true;
    } else {
      console.warn("already revoked");
    }
    return ok;
  }, [auth.user, setAuth, guest.preferences]);

  const setPWAInstalled = useCallback(async (how) => {
    console.log("AuthProvider setPWAInstalled, user:", auth.user);
    if (auth.user) {
      setAuth({ user: {
        ...auth.user,
        PWAInstalled: how, // how is a boolean
      }});
    }
  }, [auth.user, setAuth]);

  const setRequestErrors = useCallback(async (how) => {
    console.log("AuthProvider setRequestErrors, user:", auth.user);
    if (auth.user) {
      setAuth({ user: {
        ...auth.user,
        requestErrors: how, // how is a boolean
      }});
    }
  }, [auth.user, setAuth]);

  // const updateSignedInUserLocally = useCallback(async (updatedUser) => {
  //   setAuth({ user: updatedUser });
  // }, [setAuth]);
  const updateSignedInUserLocally = useCallback((updatedFields) => {
    setAuth(prevAuth => ({
      user: { 
        ...prevAuth.user, 
        ...updatedFields 
      }
    }));
  }, [setAuth]);
  
    // Clear and reset session timer
  const clearSessionTimer = () => {
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  };

  // Restart timer if user already signed in
  useEffect(() => {
    if (auth.user?.refreshTokenExpiresAt) {
      startSessionTimer(auth.user.refreshTokenExpiresAt);
    }
    return () => clearSessionTimer();
  }, [auth.user?.refreshTokenExpiresAt, startSessionTimer]);


  // Expose signOut globally
  useEffect(() => {  
    globalSignOut = signOut;
    return () => { globalSignOut = null; };
  }, [signOut]);


  return (
    <AuthContext.Provider value={{
      auth, guest, preferences,
      isLoggedIn, didSignInBefore, signIn, updateSignedInUserPreferences,
      cloneGuestUserPreferencesToAuthUserOnSignup, signOut, revoke, changeLocale,
      toggleTheme, isPWAInstalled, setPWAInstalled, updateSignedInUserLocally,
      requestErrors, setRequestErrors,
    }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
