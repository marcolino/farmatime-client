import { useState } from "react";
import { PushNotificationsStatusContext, initialState } from "./PushNotificationsStatusContext";

const PushNotificationsStatusProvider = (props) => {
  const [status, setStatus] = useState(initialState);

  return (
    <PushNotificationsStatusContext.Provider value={{ status, setStatus }}>
      {props.children}
    </PushNotificationsStatusContext.Provider>
  )
};

export { PushNotificationsStatusProvider };
