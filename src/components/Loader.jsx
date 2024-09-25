import React from "react";
import { Box, CircularProgress } from "@mui/material";
//import { useRedirect } from "../providers/RedirectProvider";
import { useLoader } from "../providers/LoaderProvider";
import config from "../config";


function Loader({ loading = false, lazyloading = false, disabled = false }) {
  //console.log("Loader - loading:", loading, ", lazyloading:", lazyloading);
  //const { isRedirecting } = useRedirect();
  const { disableLoader } = useLoader();
  
  return (loading || lazyloading) && !disableLoader && (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex="999"
      backgroundColor="rgba(0, 0, 0, 0.0)"
    >
      <CircularProgress
        variant="indeterminate"
        color={config.spinner.color}
        thickness={config.spinner.thickness}
        size={config.spinner.size}
        sx={{ opacity: config.spinner.opacity }}
      />
    </Box>
  );
};

export default React.memo(Loader);
