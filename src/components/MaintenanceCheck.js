import { useEffect } from "react";
import { apiCall } from "../libs/Network";

const MaintenanceCheck = () => {
  useEffect(() => {
    (async () => {
      try {
        console.info("async maintenance status check...");
        apiCall("get", "/misc/maintenanceStatus").then(response => {
          if (response.message === true) {
            if (window.location.pathname !== "/work-in-progress") {
              window.location.href = "/work-in-progress";
            } else {
              // already on "/work-in-progress" page, do nothing
            }
          } else {
            if (window.location.pathname === "/work-in-progress") {
              // no maintenance,  on "/work-in-progress" page, redirect to home (or to the saved original page, when and if we will save it...)
              const maintenancePath = (localStorage.getItem("x-maintenance-path"));
              localStorage.removeItem("x-maintenance-path");
              window.location.href = maintenancePath ?? "/";
            } else {
              // no maintenance and on different page, do nothing
            }
          }
        });
      } catch (error) {
        console.error("Error checking maintenance status", error);
      }
    })();
  }, [window]);

  return null; // this component doesn't render anything
};

export default MaintenanceCheck;
