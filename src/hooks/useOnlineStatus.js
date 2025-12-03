import { useContext } from 'react';
import { OnlineStatusContext } from '../providers/OnlineStatusContext';

export const useOnlineStatus = () => {
  const onlineStatus = useContext(OnlineStatusContext);
  return onlineStatus;
};