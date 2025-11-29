import { useContext, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  IconButton,
  Slide
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { HelpContext } from "../providers/HelpContext";
import { useTranslation } from "react-i18next";

const Transition = Slide;

export default function HelpVideoDialog() {
  const { open, closeHelp, showHelpIcon, setShowHelpIcon } =
    useContext(HelpContext);
  const { t } = useTranslation();

  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  // Hide/show checkbox bar when paused or ended
  const handleVideoState = () => {
    const video = videoRef.current;
    if (!video) return;

    setControlsVisible(video.paused || video.ended);
  };

  // Autoplay when dialog opens
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (open) {
      setLoading(true);
      setControlsVisible(false);
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [open]);

  // Loading state
  const handleLoadedData = () => setLoading(false);

  // ESC closes dialog + stops video
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) {
        closeHelp();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeHelp]);

  // Checkbox toggle
  const handleHideHelp = (e) => {
    const checked = e.target.checked;
    localStorage.setItem("hideHelpButton", checked ? "true" : "false");
    setShowHelpIcon(!checked);
  };

  return (
    <Dialog
      open={open}
      onClose={closeHelp}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          backgroundColor: "black",
          boxShadow: "none",
          borderRadius: 3,
          overflow: "hidden",
          p: 0,
        },
      }}
      TransitionComponent={Transition}
      transitionDuration={400}
    >
      {/* Close button (only when paused or finished) */}
      {controlsVisible && (
        <IconButton
          onClick={closeHelp}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
      )}

      <DialogContent sx={{ p: 0, backgroundColor: "black" }}>
        {/* Progress bar while loading */}
        {loading && (
          <LinearProgress
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 5,
            }}
          />
        )}

        {/* Video */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "black",
          }}
        >
          <video
            ref={videoRef}
            src="/videos/presentation-it.mp4"
            playsInline
            controls={controlsVisible}
            onLoadedData={handleLoadedData}
            onPause={handleVideoState}
            onEnded={handleVideoState}
            onPlay={() => setControlsVisible(false)}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100vh",
              borderRadius: 8,
            }}
          />
        </Box>

        {/* Slide-down checkbox bar */}
        <Slide direction="up" in={controlsVisible}>
          <Box
            sx={{
              width: "100%",
              bgcolor: "rgba(0,0,0,0.7)",
              color: "white",
              p: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ color: "white" }}
                  checked={!showHelpIcon}
                  onChange={handleHideHelp}
                />
              }
              label={t("Hide help button")}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.85rem",
                },
              }}
            />
          </Box>
        </Slide>
      </DialogContent>
    </Dialog>
  );
}
