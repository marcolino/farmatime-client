import React, { createContext } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

const initialState = { user: false };

const AuthContext = createContext(initialState);
//console.log("COOKIE - RESET AUTHCONTEXT TO INITIALSTATE");

const AuthProvider = (props) => {
  //console.log("calling usePersistedState with initialstate =", initialState);
  const [auth, setAuth] = usePersistedState("auth", initialState);

  // const handleSetAuth = (state, persistentAmongSessions) => {
  //   setAuth({ user: state.user, persistentAmongSessions });
  // };
  // const handleSetAuth = (state, persistentAmongSessions) => {
  //   setAuth({ ...auth, ...state, persistentAmongSessions });
  // };
  return (
    <AuthContext.Provider value={{ auth, setAuth/*: handleSetAuth*/ }}>
      {props.children}
    </AuthContext.Provider>
  )
};

export { AuthProvider, AuthContext };
