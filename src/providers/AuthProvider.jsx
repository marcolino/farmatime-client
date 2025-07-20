import { useState, /*createContext, */useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { usePersistedState } from "../hooks/usePersistedState";
import { apiCall } from "../libs/Network";
import config from "../config";

const initialStateUser = { user: null }; // initial state for user, when app if first loaded
const initialStatePreferences = { locale: config.serverLocale, theme: config.ui.defaultTheme }; // initial state for locale and theme (used for guest users only), when app if first loaded

//const AuthContext = createContext(initialStateUser);


const AuthProvider = (props) => {
  const [auth, setAuth] = usePersistedState("auth", initialStateUser);
  const [guest, setGuest] = usePersistedState("guest", initialStateUser);
  const isLoggedIn = (!!auth.user);
  const didSignInBefore = (auth.user !== null);
  const [preferences, setPreferences] = useState(isLoggedIn ? auth.user?.preferences : initialStatePreferences);

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
  });

  const updateSignedInUserPreferences = useCallback(async (user) => {
    console.log("AuthProvider updateSignedInUserPreferences, user:", user);
    setAuth({ user });
    if (user && user.preferences) {
      setPreferences(user.preferences);
      updateUserPreferences(user, user.preferences);
    }
  });

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
      alert("cloned guest user preferences to auth user: " + JSON.stringify(newUser));
    }
  };

  // centralized sign out function
  const signOut = useCallback(async () => {
    let ok = false;
    if (auth.user) {
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
      setAuth({ user: false }); // user is not set, but not null, it means she has an account
      setPreferences(guest.preferences);
    } else {
      console.warn("already signed out");
    }
    return ok;
  }, [auth.user, setAuth, guest.preferences]);

  const revoke = useCallback(async () => {
    let ok = false;
    if (auth.user !== null) {
      setAuth({ user: null }); // user is not set, and null, it means she has not an account 8anymore9
      setPreferences(guest.preferences);
      ok = true;
    } else {
      console.warn("already revoked");
    }
    return ok;
  }, [auth.user, setAuth, guest.preferences]);

  return (
    <AuthContext.Provider value={{ auth, guest, preferences, isLoggedIn, didSignInBefore, signIn, updateSignedInUserPreferences, cloneGuestUserPreferencesToAuthUserOnSignup, signOut, revoke, changeLocale, toggleTheme }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
