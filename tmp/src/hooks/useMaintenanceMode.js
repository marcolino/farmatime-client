import { useState, useEffect } from "react";
import { apiCall } from "../libs/Network";

const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    const checkMaintenanceMode = async() => {
      try {
        const result = await apiCall("post", "/misc/isMaintenance", {});
console.log("apiCall /misc/isMaintenance result.status:", result.status);
        setIsMaintenanceMode(result.status === 503); // TODO: 503 !!!
      } catch (error) {
        console.error("Error checking maintenance mode:", error);
        // optionally set to false or true depending on your preference in case of an error
        setIsMaintenanceMode(false);
      }
    };

    checkMaintenanceMode();

    // optionally, set up an interval to periodically check the maintenance status
    const intervalId = setInterval(checkMaintenanceMode, 5 /* * 60 */ * 1000); // check every 5 minutes

    return () => clearInterval(intervalId); // clean up interval on component unmount
  }, []);

  return isMaintenanceMode;
};

export default useMaintenanceMode;
