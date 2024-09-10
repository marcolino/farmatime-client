import React, { createContext } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

const initialState = { user: false };

const AuthContext = createContext(initialState);
//console.log("COOKIE - RESET AUTHCONTEXT TO INITIALSTATE");

const AuthProvider = (props) => {
  //console.log("calling usePersistedState with initialstate =", initialState);
  const [auth, setAuth] = usePersistedState('auth', initialState);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  )
};

export { AuthProvider, AuthContext };
