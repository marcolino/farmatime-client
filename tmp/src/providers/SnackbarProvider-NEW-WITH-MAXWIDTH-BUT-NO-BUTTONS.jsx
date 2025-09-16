import { useContext, useMemo, forwardRef } from "react";
import {
  SnackbarProvider as NotistackSnackbarProvider,
  useSnackbar,
} from "notistack";
import { SnackbarContext } from "./SnackbarContext";
import { IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import config from "../config";

// --- Custom snackbar content with ref-forwarding ---
const CustomSnack = forwardRef(function CustomSnack(
  { id, message, onClose, variant = "default" },
  ref
) {
  const theme = useTheme();

  const bgColor =
    variant === "success"
      ? theme.palette.success.main
      : variant === "error"
      ? theme.palette.error.main
      : variant === "warning"
      ? theme.palette.warning.main
      : variant === "info"
      ? theme.palette.info.main
      : theme.palette.grey[800];

  const textColor = theme.palette.getContrastText(bgColor);

  return (
    <Paper
      ref={ref}
      elevation={6}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 2,
        px: 3,
        width: "min(420px, 90vw)",
        whiteSpace: "normal",
        boxSizing: "border-box",
        bgcolor: bgColor,
        color: textColor,
        borderRadius: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          fontSize: config.ui.snacks.style.fontSize,
          fontFamily: config.index.fontFamily,
        }}
      >
        {typeof message === "string" ? message : message}
      </Typography>

      <IconButton
        size="small"
        onClick={() => onClose(id)}
        color="inherit"
        aria-label="close"
      >
        <CloseIcon sx={{ fontSize: config.ui.snacks.closeIcon.fontSize }} />
      </IconButton>
    </Paper>
  );
});

// --- Inner provider exposing showSnackbar / closeSnackbar ---
const InnerSnackbarProvider = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showSnackbar = (message = null, variant = "default") => {
    if (!message) return;

    enqueueSnackbar(message, {
      variant,
      content: (key, msg) => (
        <CustomSnack
          id={key}
          message={msg}
          onClose={closeSnackbar}
          variant={variant}
        />
      ),
    });
  };

  const contextValue = useMemo(
    () => ({ showSnackbar, closeSnackbar }),
    [showSnackbar, closeSnackbar]
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
    </SnackbarContext.Provider>
  );
};

// --- Wrapper for NotistackSnackbarProvider ---
export const SnackbarProviderWrapper = ({ children }) => {
  return (
    <NotistackSnackbarProvider
      maxSnack={config.ui.snacks.maxInStack}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      autoHideDuration={config.ui.snacks.autoHideDurationSeconds * 1000}
      preventDuplicate={config.mode.production}
    >
      <InnerSnackbarProvider>{children}</InnerSnackbarProvider>
    </NotistackSnackbarProvider>
  );
};

// Hook to access snackbar context
export const useSnackbarContext = () => useContext(SnackbarContext);
