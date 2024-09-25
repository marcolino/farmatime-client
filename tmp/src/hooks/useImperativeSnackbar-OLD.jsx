import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import config from "../config";

function useImperativeSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // custom showSnackbar with action support
  const showSnackbar = (message, variant = "default", action = dismissAction) => {
    enqueueSnackbar(message, {
      variant,
      action: (key) => (
        <>
          {action && action(key)} {/* render custom action if provided */}
        </>
      ),
      autoHideDuration: config.ui.snacks.autoHideDuration,
      style: { fontSize: "1.1rem", whiteSpace: "pre-line" }, // allow multi-line
    });
  };

  const dismissAction = (key) => (
    <Button onClick={() => closeSnackbar(key)} color="secondary">
      <CloseIcon sx={{fontSize: "1rem"}} />
    </Button>
  );

  return { showSnackbar, dismissAction };
}

export default useImperativeSnackbar;



// ORIGINAL VERSION
// import { useSnackbar } from "notistack";

// function useImperativeSnackbar() {
//   const { enqueueSnackbar } = useSnackbar();

//   const showSnackbar = (message, variant = "default") => {
//     enqueueSnackbar(message, { variant });
//   };

//   return { showSnackbar };
// }

// export default useImperativeSnackbar;