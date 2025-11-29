// src/components/HelpVideoDialog.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  IconButton,
  Checkbox,
  FormControlLabel,
  Box,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { HelpContext } from "../providers/HelpContext";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpVideoDialog({ open, onClose }) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const { hideHelpButton, setHideHelpButton } = useContext(HelpContext);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Auto-start video reliably when dialog opens
  useEffect(() => {
    if (open && videoRef.current) {
      const playVideo = () => {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      };
      setTimeout(playVideo, 150);
    }
  }, [open]);

  // 🔥 ESC KEY HANDLER — pause video + close dialog
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (videoRef.current) {
          videoRef.current.pause();
        }
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (videoRef.current) videoRef.current.pause();
        onClose();
      }}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          backgroundColor: "black",
          position: "relative",
          overflow: "hidden",
        },
      }}
    >
      {/* --- Loading Progress Bar (while video loads) --- */}
      {!videoLoaded && (
        <Box
          sx={{
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 20,
          }}
        >
          <LinearProgress />
        </Box>
      )}

      {/* --- Video with fade-in --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: videoLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <video
          ref={videoRef}
          src="/videos/presentation-it.mp4"
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onLoadedData={() => setVideoLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            maxHeight: "100vh",
            objectFit: "contain",
            backgroundColor: "black",
          }}
        />
      </motion.div>

      {/* --- Overlay (close button + slide-down checkbox) --- */}
      <AnimatePresence>
        {!isPlaying && videoLoaded && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
            }}
          >
            {/* Close button */}
            <IconButton
              onClick={() => {
                if (videoRef.current) videoRef.current.pause();
                onClose();
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 30,
                color: "white",
                bgcolor: "rgba(0,0,0,0.4)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                pointerEvents: "auto",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Slide-down animated checkbox bar */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                pointerEvents: "auto",
              }}
            >
              <Box
                sx={{
                  py: 1,
                  background: "rgba(0,0,0,0.75)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hideHelpButton}
                      onChange={(e) => setHideHelpButton(e.target.checked)}
                      sx={{ color: "white" }}
                    />
                  }
                  label={t("Hide help button X")}
                  sx={{
                    color: "white",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.85rem",
                      opacity: 0.85,
                      fontStyle: "italic",
                    },
                  }}
                />
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
