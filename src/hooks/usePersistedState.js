import { useState, useCallback } from "react";
import LocalStorage from "../libs/LocalStorage";

export const usePersistedState = (key, defaultValue) => {
  const [state, setStateInternal] = useState(() => {
    const persisted = LocalStorage.get(key);
    return persisted !== null && persisted !== undefined ? persisted : defaultValue;
  });

  const setState = useCallback((value) => {
    setStateInternal(prev => {
      const newValue = typeof value === "function" ? value(prev) : value;
      LocalStorage.set(key, newValue);
      return newValue;
    });
  }, [key]);

  return [state, setState];
};

// import React, { useEffect } from "react";
// import LocalStorage from "../libs/LocalStorage";

// export const usePersistedState = (key, defaultValue) => {
//   const [state, setState] = React.useState(() => {
//     return LocalStorage.get(key) || defaultValue;
//   });

//   const prevKeyRef = React.useRef(key);

//   useEffect(() => {
//     // check if the key has changed
//     if (prevKeyRef.current !== key) {
//       // reset state to the value of the new key
//       const newState = LocalStorage.get(key) || defaultValue;
//       prevKeyRef.current = key;
//       setState(newState);
//     } else { // persist state to the current key
//       LocalStorage.set(key, state);
//     }
//   }, [key, state, defaultValue]);

//   return [state, setState];
// };
