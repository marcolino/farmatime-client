import { useCallback } from "react";
import { Fab } from "@mui/material";
import { NotificationsActive } from "@mui/icons-material";
import { useVisibilityPolling } from "../hooks/useVisibilityPolling";


const FloatingBell = ({ warning, pollingCallback, onOkCallback }) => {
  const memoizedPoll = useCallback(async () => {
    try {
      const response = await pollingCallback();
      if (response.err) {
        console.error("Error while polling server:", response.err);
      }
    } catch (err) {
      console.error("Polling server failed:", err);
    }
  }, [pollingCallback]);

  useVisibilityPolling(memoizedPoll);

  if (!warning) { // Do nothing
    return null;
  }
  
  return ( // set / reset
    <Fab
      onClick={onOkCallback}
      color="error"
      aria-label="notification icon"
      sx={{
        position: "fixed",
        bottom: 32, // distance from bottom
        right: 32, // distance from right
        //zIndex: 9999, // on top of everything else
      }}
    >
      <NotificationsActive />
    </Fab>
  );

//   return (
//     <>
//       {warning && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "20px",
//             right: "20px",
//             background: "#ffcc00",
//             padding: "12px",
//             borderRadius: "50%",
//             fontSize: "24px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//           }}
//         >
//           🔔
//         </div>
//       )}
//     </>
//   );
};

export default FloatingBell;
