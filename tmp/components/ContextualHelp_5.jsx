import React, { useState, useRef } from "react";
import { IconButton, Modal, Box, Typography, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

// Help content definitions
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

// Placement to style map
const placementStyles = {
  "top-right": { top: 4, right: 4 },
  "top-left": { top: 4, left: 4 },
  "bottom-right": { bottom: 4, right: 4 },
  "bottom-left": { bottom: 4, left: 4 },
};

export function ContextualHelp({
  helpPagesKey,
  icon = <InfoIcon fontSize="small" />,
  placement = "top-right",
}) {
  const [open, setOpen] = useState(false);
  const helpRef = useRef(null);
  const help = HelpPages[helpPagesKey];

  if (!help) return null;

  const iconStyle = {
    position: "absolute",
    zIndex: 10,
    ...(placementStyles[placement] || placementStyles["top-right"]),
  };

  return (
    <>
      <div ref={helpRef} style={iconStyle}>
        <IconButton size="small" onClick={() => setOpen(true)}>
          {icon}
        </IconButton>
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
            p: 4,
            borderRadius: 2,
            outline: "none",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {help.title}
          </Typography>
          <div>{help.content}</div>
        </Box>
      </Modal>
    </>
  );
}

// Container that optionally wraps floating icon in a tooltip
export function ContextualHelpContainer({ children, showTooltip = false }) {
  return (
    <div style={{ position: "relative" }}>
      {React.Children.map(children, (child) => {
        if (
          showTooltip &&
          child?.type === ContextualHelp &&
          child?.props?.helpPagesKey
        ) {
          const key = child.props.helpPagesKey;
          const title = HelpPages[key]?.title || "Help";

          return (
            <Tooltip title={title} arrow>
              <span>{child}</span>
            </Tooltip>
          );
        }
        return child;
      })}
    </div>
  );
}
