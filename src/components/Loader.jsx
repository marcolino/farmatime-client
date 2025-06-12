import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useLoader } from "../providers/LoaderProvider";
import config from "../config";


function Loader({ loading = false, lazyloading = false }) {
  const { disableLoader } = useLoader();
  
  return (
    ((loading || lazyloading) && !disableLoader) ? (
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw", // ensure full viewport width
        height: "100vh", // ensure full viewport height
        zIndex: 999, // higher z-index to ensure it's above everything
        bgColor: "rgba(0, 0, 0, 0.1)", // darken the background for contrast
      }}>
        <CircularProgress
          variant="indeterminate"
          color="primary" // set explicitly to ensure visibility
          thickness={config.spinner.thickness}
          size={config.spinner.size}
          sx={{ opacity: config.spinner.opacity }}
        />
      </Box>
    ) : null
  );
};

export default React.memo(Loader);
