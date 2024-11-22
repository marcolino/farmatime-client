import React, { createContext, useCallback } from "react";
import { usePersistedState } from "../hooks/usePersistedState";
import { apiCall } from "../libs/Network";

const initialState = { user: false };

const AuthContext = createContext(initialState);

const AuthProvider = (props) => {
  const [auth, setAuth] = usePersistedState("auth", initialState);

  // centralized sign out function
  const signOut = useCallback(async () => {
    let ok = false;
    if (auth.user) {
      try {
        const result = await apiCall("post", "/auth/signout", { email: auth.user.email });
        if (result.err) {
          // do not even show error to user, signout is also completed only client side
          console.error("SignOut error:", result);
        } else {
          ok = true
          console.log("Sign out successful", result);
        }
      } catch (error) {
        console.error("SignOut error:", error);
      }
      setAuth({ user: false });
      return ok;
    }
  }, [auth.user, setAuth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
