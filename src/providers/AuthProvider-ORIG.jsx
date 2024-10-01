import React, { createContext } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

const initialState = { user: false };

const AuthContext = createContext(initialState);

const AuthProvider = (props) => {
  const [auth, setAuth] = usePersistedState("auth", initialState);

  return (
    <AuthContext.Provider value={{ auth, setAuth/*: handleSetAuth*/ }}>
      {props.children}
    </AuthContext.Provider>
  )
};

export { AuthProvider, AuthContext };
