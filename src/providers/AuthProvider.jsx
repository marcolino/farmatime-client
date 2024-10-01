import React, { createContext, useCallback } from "react";
import { usePersistedState } from "../hooks/usePersistedState";
import { apiCall } from "../libs/Network";

const initialState = { user: false };

const AuthContext = createContext(initialState);

const AuthProvider = (props) => {
  const [auth, setAuth] = usePersistedState("auth", initialState);

  // centralized sign out function
  const signOut = useCallback(async () => {
    if (auth.user) {
      try {
        const result = await apiCall("post", "/auth/signout", { email: auth.user.email });
        if (result.err) {
          console.error("SignOut error:", result);
        } else {
          setAuth({ user: false });
          console.log("Sign out successful");
        }
      } catch (error) {
        console.error("SignOut error:", error);
      }
    }
  }, [auth.user, setAuth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
