import { useState, useEffect } from "react";
import { addLoaderListener } from "../libs/AxiosLoader";

/**
 * React hook that tells if any axios requests are in flight.
 * @returns [loading] boolean
 */
export const useAxiosLoader = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = addLoaderListener((count) => {
      setLoading(count > 0);
    });
    return unsubscribe;
  }, []);

  return [loading];
};
