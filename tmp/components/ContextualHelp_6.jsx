import React, { useState, useRef, useEffect } from "react";
import {
  IconButton,
  Modal,
  Box,
  Typography,
  Tooltip,
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

// Map placement to relative icon offset
const placementOffsets = {
  "top-left": { top: 0, left: 0 },
  "top-right": { top: 0, right: 0 },
  "bottom-left": { bottom: 0, left: 0 },
  "bottom-right": { bottom: 0, right: 0 },
};

// Help icon and modal
export function ContextualHelp({
  helpPagesKey,
  icon = <InfoIcon fontSize="small" />,
  placement = "top-left",
  showTooltip = false,
}) {
  const [open, setOpen] = useState(false);
  const iconRef = useRef(null);
  const theme = useTheme();
  const help = HelpPages[helpPagesKey];

  if (!help) return null;

  const iconButton = (
    <IconButton size="small" onClick={() => setOpen(true)} ref={iconRef}>
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
        {showTooltip ? (
          <Tooltip title={help.title} arrow>
            <span>{iconButton}</span>
          </Tooltip>
        ) : (
          iconButton
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
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
            <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: "inherit" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ p: 2 }}>{help.content}</Box>
        </Box>
      </Modal>
    </>
  );
}

// Help container that positions icon relative to its child
export function ContextualHelpContainer({ children, showTooltip = false }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {React.Children.map(children, (child) => {
        if (child?.type === ContextualHelp) {
          return React.cloneElement(child, { showTooltip });
        }
        return child;
      })}
    </div>
  );
}
