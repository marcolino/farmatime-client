import { useContext, useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  //Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { HelpContext } from "../providers/HelpContext";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpVideoDialog() {
  const videoPath = "/videos/presentation-it.mp4";
  const { open, closeHelp, showHelpIcon, setShowHelpIcon } =
    useContext(HelpContext);

  const videoRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Show overlay when paused or ended
  const handleVideoState = () => {
    const video = videoRef.current;
    if (!video) return;
    setShowOverlay(video.paused || video.ended);
  };

  // Autoplay when dialog opens
  useEffect(() => {
    if (open && videoRef.current) {
      const v = videoRef.current;
      v.muted = true; // required for autoplay on most browsers
      const playAttempt = v.play();
      if (playAttempt !== undefined) {
        playAttempt.catch(() => {
          // autoplay blocked
          v.controls = true;
        });
      }
      setShowOverlay(false);
    }
  }, [open]);

  // ESC closes dialog
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) closeHelp();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeHelp]);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    localStorage.setItem("hideHelpButton", checked ? "true" : "false");
    setShowHelpIcon(!checked);
  };

  return (
    <Dialog
      open={open}
      onClose={closeHelp}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { overflow: "hidden", borderRadius: 3, backgroundColor: "black" },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          position: "relative",
        }}
      >
        <video
          ref={videoRef}
          src={videoPath}
          controls
          autoPlay
          playsInline
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "90vh",
            display: "block",
          }}
          onPause={handleVideoState}
          onEnded={handleVideoState}
          onPlay={() => setShowOverlay(false)}
        />

        {/* Overlay for Close button and Hide Fab checkbox */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                pointerEvents: "auto",
              }}
            >
              {/* Close button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <IconButton
                  onClick={closeHelp}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.4)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Hide Fab checkbox */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  bgcolor: "rgba(0,0,0,0.7)",
                  p: 1,
                  py: 5,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!showHelpIcon}
                      onChange={handleCheckboxChange}
                      sx={{ color: "white" }}
                    />
                  }
                  label="Hide help button"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "white",
                      fontSize: "0.85rem",
                    },
                  }}
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
