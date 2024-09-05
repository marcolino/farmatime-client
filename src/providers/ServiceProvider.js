import React, { useState, createContext } from "react";

// const initialState = {
//   pushNotifications: [],
// };
const initialState = {};

const ServiceContext = createContext(initialState);

const ServiceProvider = (props) => {
  const [service, setService] = useState(initialState);

  return (
    <ServiceContext.Provider value={{ service, setService }}>
      {props.children}
    </ServiceContext.Provider>
  )
};

export { ServiceProvider, ServiceContext };
