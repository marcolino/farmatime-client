import { useCallback, useEffect, useRef/*, useContext*/ } from "react";
import { Fab } from "@mui/material";
//import { AuthContext } from "../providers/AuthContext";
import { NotificationsActive } from "@mui/icons-material";
import { useVisibilityPolling } from "../hooks/useVisibilityPolling";


const FloatingBellRequestErrors = ({ pollingCallback, onOkCallback, pollingRefreshKey }) => {
  const requestErrorsRef = useRef([]);
  const memoizedPoll = useCallback(async () => {
    try {
      const response = await pollingCallback();
      if (response.err) {
        if (response.code === "EXPIRED_TOKEN") { // Token expired while polling server
          //console.info("Token expired while polling server");
        } else {
          console.error("Error while polling server:", response);
        }
        return; // prevent clearing requestErrorsRef
      }
    } catch (err) {
      console.error("Polling server failed:", err);
    }
  }, [pollingCallback]);

  // Visibility-based polling
  useVisibilityPolling(memoizedPoll);

  // Force polling when pollingRefreshKey changes
  useEffect(() => {
    if (pollingRefreshKey !== 0) {
      memoizedPoll();
    }
  }, [pollingRefreshKey, memoizedPoll]);

  if (!requestErrorsRef.current.length) { // No requestErrors: do not show floating bell
    return null;
  }
    
  const show = requestErrorsRef.current.some(req => {
    // if seenAt is null, undefined, or falsy
    //console.log("req.seenAt:", req.seenAt);
    if (!req.seenAt) return true;

    // make sure at and seenAt are Date objects
    const at = new Date(req.at);
    const seenAt = new Date(req.seenAt);

    // return true if if at > seenAt
    //console.log("at > seenAt:", at, seenAt, at > seenAt);
    return at > seenAt;
  });
  
  return (
    <Fab
      onClick={onOkCallback}
      color="error"
      aria-label="notification icon"
      sx={{
        display: show ? "flex" : "none",
        position: "fixed",
        bottom: 36, // distance from bottom
        right: 36, // distance from right
      }}
    >
      <NotificationsActive />
    </Fab>
  );
};

export default FloatingBellRequestErrors;
