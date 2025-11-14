import { useCallback, useEffect, useContext, useRef } from "react";
import { Fab } from "@mui/material";
import { AuthContext } from "../providers/AuthContext";
import { NotificationsActive } from "@mui/icons-material";
import { useVisibilityPolling } from "../hooks/useVisibilityPolling";


const FloatingBell = ({ pollingCallback, onOkCallback, pollingRefreshKey }) => {
  const { isLoggedIn, auth } = useContext(AuthContext);
  const requestErrorsRef = useRef([]);
  const memoizedPoll = useCallback(async () => {
    try {
      const response = await pollingCallback();
      if (response.err) {
        if (response.code === "EXPIRED_TOKEN") {
          console.info("Token expired while polling server"); // TODO: DEBUG ONLY (ignore this use case)
        } else {
          console.error("Error while polling server:", response);
        }
      }
      requestErrorsRef.current = response.requestErrors || [];
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
  if (!show) { // All request errors already seen: do not show floating bell
    //console.log("HIDING BELL");
    return null;
  }
  else {
    //console.log("SHOWING BELL");
  }
  
  return (
    <Fab
      onClick={onOkCallback}
      color="error"
      aria-label="notification icon"
      sx={{
        position: "fixed",
        bottom: 36, // distance from bottom
        right: 36, // distance from right
      }}
    >
      <NotificationsActive />
    </Fab>
  );
};

export default FloatingBell;
