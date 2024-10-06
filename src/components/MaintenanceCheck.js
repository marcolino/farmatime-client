import { useEffect } from "react";
//import { useLocation, useNavigate } from "react-router-dom"; // we can't use it because we ar e before the router section
import { apiCall } from "../libs/Network";

const MaintenanceCheck = () => {
      
  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        if (window.location.href === "/work-in-progress") {
          return;
        }
        const response = await apiCall("get", "/misc/maintenanceStatus");
        if (response.message === true) {
          window.location.href = "/work-in-progress";
        }
      } catch (error) {
        console.error("Error checking maintenance status", error);
      }
    };
    checkMaintenanceMode();
  }, [window]);

  return null; // this component doesn't render anything
};

export default MaintenanceCheck;
