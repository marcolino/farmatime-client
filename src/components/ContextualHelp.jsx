import { useState, useRef } from "react";
//import { useTranslation } from 'react-i18next';
import {
  Box,
  IconButton,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import HelpPages from "./help/HelpPages";

export function ContextualHelpWrapper({
  children,
  helpPagesKey,
  icon = <InfoIcon fontSize="medium" />,
  placement = "top-left",
  fullWidth = false,
  showOnMobileToo = false,
}) {
  //const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const iconButtonRef = useRef(null);
  const { isMobile } = useMediaQueryContext();

  const placementOffsets = {
    "top-left": { top: -28, left: -28 },
    "top-right": { top: -28, right: 28 },
    "bottom-left": { bottom: 28, left: -28 },
    "bottom-right": { bottom: 28, right: 28 },
  };

  const helpPages = HelpPages();
  const help = helpPages[helpPagesKey];
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
      {(!isMobile || showOnMobileToo) && (
        <>
          <Box
            sx={{
              position: "absolute",
              zIndex: 10,
              ...placementStyle,
            }}
            onClick={handleOpen}
          >
            <IconButton
              size="large"
              sx={{ color: theme.palette.primary.main }}
              ref={iconButtonRef}
              tabIndex={-1} // Skip focus when tabbing
            >
              {icon}
            </IconButton>
          </Box>
      
            <Modal
              open={open}
              onClose={handleClose}
              disableAutoFocus
              slotProps={{
                backdrop: {
                  sx: {
                    bgColor: 'rgba(0, 0, 0, 0.1)', // Semi transparent background
                  },
                },
              }}
            >
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
                  <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{ color: "inherit" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ p: 2, whiteSpace: 'pre-line' }}>{help.content}</Box>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
}

export const ContextualHelp = ContextualHelpWrapper;
