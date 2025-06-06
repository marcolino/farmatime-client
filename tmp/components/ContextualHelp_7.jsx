import React, { useState, useRef } from "react";
import {
  IconButton,
  Modal,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

// Help content
const HelpPages = {
  MedicineName: {
    title: "Medicine Name",
    content: (
      <>
        <p>
          Enter the name of the medicine, its active ingredient, or its ATC code.
        </p>
        <p>
          You can use the autocomplete feature to help you find the correct medicine.
        </p>
        <ul>
          <li>Point 1 ...</li>
          <li>Point 2 ...</li>
        </ul>
      </>
    ),
  },
  DateSince: {
    title: "Date of first request",
    content: (
      <>
        <p>Enter the date when the first request to the doctor should be made.</p>
      </>
    ),
  },
};

// Placement to offset map
const placementOffsets = {
  "top-left": { top: 0, left: 0 },
  "top-right": { top: 0, right: 0 },
  "bottom-left": { bottom: 0, left: 0 },
  "bottom-right": { bottom: 0, right: 0 },
};

export function ContextualHelp({
  helpPagesKey,
  icon = <InfoIcon fontSize="small" />,
  placement = "top-left",
  showOnHover = false,
}) {
  const [open, setOpen] = useState(false);
  const help = HelpPages[helpPagesKey];
  const theme = useTheme();

  if (!help) return null;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const iconButton = (
    <IconButton
      size="small"
      sx={{ color: "primary.main" }}
      onClick={!showOnHover ? handleOpen : undefined}
      onMouseEnter={showOnHover ? handleOpen : undefined}
      onMouseLeave={showOnHover ? handleClose : undefined}
    >
      {icon}
    </IconButton>
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          ...(placementOffsets[placement] || placementOffsets["top-left"]),
          margin: 4,
          zIndex: 10,
        }}
      >
        {iconButton}
      </div>

      <Modal open={open} onClose={handleClose}>
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
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
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
    </>
  );
}

// Layout-transparent container
export function ContextualHelpContainer({ children, showOnHover = false }) {
  const content = React.Children.map(children, (child) => {
    if (child?.type === ContextualHelp) {
      return React.cloneElement(child, { showOnHover });
    }
    return child;
  });

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {content}
    </div>
  );
}

