import { createContext } from "react";

const initialState = {
  pushNotifications: [],
};

const PushNotificationsStatusContext = createContext(initialState);

export { PushNotificationsStatusContext, initialState };
