import { useEffect } from "react";
//import { useLocation, useNavigate } from "react-router-dom"; // we can't use it because we are outside the router section
import { apiCall } from "../libs/Network";

const MaintenanceCheck = () => {
  useEffect(() => {
    (async () => {
      try {
        const response = await apiCall("get", "/misc/maintenanceStatus");
        if (response.message === true) {
          if (window.location.pathname !== "/work-in-progress") {
            window.location.href = "/work-in-progress";
          } else {
            // already on "/work-in-progress" page, do nothing
          }
        } else {
          if (window.location.pathname === "/work-in-progress") {
            // no maintenance,  on "/work-in-progress" page, redirect to home (or to the saved original page, when and if we will save it...)
            window.location.href = "/";
          } else {
            // no maintenance, on different page, do nothing
          }
        }
      } catch (error) {
        console.error("Error checking maintenance status", error);
      }
    })();
    // checkMaintenanceMode();
  }, [window]);

  return null; // this component doesn't render anything
};

export default MaintenanceCheck;
