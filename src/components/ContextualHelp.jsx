import { useState, useRef } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

// Help content map
const HelpPages = {
  MedicineName: {
    title: "Medicine Name",
    content: (
      <>
        <p>Enter the name of the medicine, its active ingredient, or its ATC code.</p>
        <p>You can use the autocomplete feature to help you find the correct medicine.</p>
      </>
    ),
  },
  DateSince: {
    title: "Date of first request",
    content: (
      <>
        <p>Enter the date when the first request to the doctor should be made.</p>
        <p>For example, if you have some pills left, and you foresee to finish
          it in a week, you should enter the day after a week from now.</p>
      </>
    ),
  },
  Frequency: {
    title: "The frequency of the requests, in days",
    content: (
      <>
        <p>Enter the frequency of the requests, in day.</p>
        <p>For example, if you have to take 2 pills a day, and the packaging contains 36 pills, you should enter 18 here, to request the medicine every 18 days.</p>
      </>
    ),
  },
};

const placementOffsets = {
  "top-left": { top: -18, left: -18 },
  "top-right": { top: -18, right: 18 },
  "bottom-left": { bottom: 18, left: -18 },
  "bottom-right": { bottom: 18, right: 18 },
};

export function ContextualHelpWrapper({
  children,
  helpPagesKey,
  icon = <InfoIcon fontSize="small" />, 
  placement = "top-left",
  fullWidth = false,
}) {
  const [open, setOpen] = useState(false);
  const help = HelpPages[helpPagesKey];
  const theme = useTheme();
  const iconButtonRef = useRef(null);

  if (!help) return children;

  const placementStyle = placementOffsets[placement] || placementOffsets["top-left"];

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{
      position: "relative",
      ...(fullWidth && { width: "100%" }),
    }}>
      <Box>{children}</Box>
      <Box
        sx={{
          position: "absolute",
          zIndex: 10,
          ...placementStyle,
        }}
        onClick={handleOpen}
      >
        <IconButton
          size="small"
          sx={{ color: theme.palette.primary.main }}
          ref={iconButtonRef}
        >
          {icon}
        </IconButton>
      </Box>

      <Modal open={open} onClose={handleClose} disableAutoFocus>
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            maxHeight: "80%",
            width: "90%",
            maxWidth: 600,
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 0,
            borderRadius: 2,
            outline: "none",
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
              py: 1,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          >
            <Typography variant="h6">{help.title}</Typography>
            <IconButton onClick={handleClose} size="small" sx={{ color: "inherit" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 2 }}>{help.content}</Box>
        </Box>
      </Modal>
    </Box>
  );
}

export const ContextualHelp = ContextualHelpWrapper;
