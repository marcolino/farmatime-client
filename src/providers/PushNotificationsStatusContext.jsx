import { createContext } from "react";

export const initialState = {
  pushNotifications: [],
};

export const PushNotificationsStatusContext = createContext(initialState);