import React from "react";
//import { usePromiseTracker } from "react-promise-tracker";
import { useAxiosLoader } from "../hooks/useAxiosLoader";
import { Box, CircularProgress } from '@mui/material';
import config from "../config";


function Loader(props) {
  //const { promiseInProgress } = usePromiseTracker({delay: config.spinner.delay});
  const [loading] = useAxiosLoader();

  return loading && (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
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
