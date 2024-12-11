import React, { useState, createContext, useCallback } from "react";
import { usePersistedState } from "../hooks/usePersistedState";
import { apiCall } from "../libs/Network";
import config from "../config";

const initialStateUser = { user: null }; // initial state for user, when app if first loaded
const initialStatePreferences = { locale: config.serverLocale, theme: config.ui.defaultTheme }; // initial state for locale and theme (used for guest users only), when app if first loaded

const AuthContext = createContext(initialStateUser);

const AuthProvider = (props) => {
  const [auth, setAuth] = usePersistedState("auth", initialStateUser);
  const [preferences, setPreferences] = usePersistedState("preferences", initialStatePreferences);
  const didSignInBefore = (auth.user !== null);

  // centralized sign out function
  const signIn = useCallback(async (user) => {
    setAuth({ user });
    setPreferences({ locale: user.preferences.locale, theme: user.preferences.theme });
  });

  const updateSignIn = useCallback(async (user) => {
    setAuth({ user });
    setPreferences({ locale: user.preferences.locale, theme: user.preferences.theme });
  });

  const changeLocale = useCallback((locale) => {
    setPreferences({
      ...preferences, // spread the current preferences to keep existing keys
      locale, // update the locale
    });
  }, [preferences, setPreferences]);

  const toggleTheme = useCallback(async () => {
    const newPreferences = {
      ...preferences,
      theme: preferences.theme === "light" ? "dark" : "light", // update the theme
    };

    // Set the state and serialize to the database
    setPreferences(newPreferences);
    // setPreferences({
    //   ...preferences, // spread the current preferences to keep existing keys
    //   theme: preferences.theme === "light" ? "dark" : "light", // update the theme
    // });
    let ok = false;
    if (auth.user) {
      try {
        const result = await apiCall("post", "/user/updateUser", { email: auth.user.email, preferences: newPreferences });
        if (result.err) {
          // do not even show error to user, signout is also completed only client side
          console.error("update user error:", result.err);
        } else {
          ok = true
          console.log("update user successful", result);
        }
      } catch (error) {
        console.error("update user error:", error);
      }
    } else {
      console.warning("can't update guest user preferences");
    }
  }, [preferences, setPreferences]);

  const isLoggedIn = auth.user ? true : false;

  // centralized sign out function
  const signOut = useCallback(async () => {
    let ok = false;
    if (auth.user) {
      try {
        const result = await apiCall("post", "/auth/signout", { email: auth.user.email });
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
      setAuth({ user: false }); // user is not set, but not null, it means she has an account
      setPreferences(initialStatePreferences); // on sign out, reset initial state preferences
      return ok;
    } else {
      console.warning("already signed out");
    }
  }, [auth.user, setAuth]);

  console.log("AuthContext.Provider value:", {
    auth,
    preferences,
    isLoggedIn,
    didSignInBefore,
    signIn,
    updateSignIn,
    signOut,
    toggleTheme,
  });

  return (
    <AuthContext.Provider value={{ auth, preferences, isLoggedIn, didSignInBefore, signIn, updateSignIn, signOut, changeLocale, toggleTheme }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
