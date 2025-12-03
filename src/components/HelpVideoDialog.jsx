import { useContext, useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Checkbox,
  FormControlLabel,
  IconButton,
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
<<<<<<< HEAD
    //console.log("VVV - handleVideoState", video.paused, video.ended, video);
=======
>>>>>>> 648f52018e27f82308f8885bc1bbbdf43c1115d2
    setShowOverlay(video.paused || video.ended);
  };

  // Autoplay when dialog opens
  useEffect(() => {
    if (open && videoRef.current) {
<<<<<<< HEAD
      //console.log("VVV - autoplay video", videoRef.current);
=======
>>>>>>> 648f52018e27f82308f8885bc1bbbdf43c1115d2
      const v = videoRef.current;
      v.muted = true; // required for autoplay
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
<<<<<<< HEAD
  // useEffect(() => {
  //   console.log("VVV - autoplay video", open, videoRef?.current);
  //   if (open && videoRef.current) {
  //     const v = videoRef.current;
  //     v.muted = true;
      
  //     // Explicit ended handler to force stop
  //     const handleEnded = () => {
  //       v.pause();
  //       // Don't let it restart
  //       v.currentTime = v.duration;
  //       setShowOverlay(true);
  //     };
      
  //     v.addEventListener('ended', handleEnded);
      
  //     const playAttempt = v.play();
  //     if (playAttempt !== undefined) {
  //       playAttempt.catch(() => {
  //         v.controls = true;
  //       });
  //     }
  //     setShowOverlay(false);
      
  //     return () => {
  //       v.removeEventListener('ended', handleEnded);
  //     };
  //   }
  // }, [open]);
=======
>>>>>>> 648f52018e27f82308f8885bc1bbbdf43c1115d2

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
<<<<<<< HEAD
          preload="auto" // Force full preload instead of metadata only
          onPause={handleVideoState}
          onEnded={handleVideoState}
          onPlay={() => setShowOverlay(false)}
=======
>>>>>>> 648f52018e27f82308f8885bc1bbbdf43c1115d2
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "90vh",
            display: "block",
          }}
<<<<<<< HEAD
=======
          onPause={handleVideoState}
          onEnded={handleVideoState}
          onPlay={() => setShowOverlay(false)}
>>>>>>> 648f52018e27f82308f8885bc1bbbdf43c1115d2
        />

        {/* Top overlay: Close button right, Checkbox left */}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                pointerEvents: "auto",
              }}
            >
              {/* Hide Fab checkbox (left) */}
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
                  mt: 1,
                  ml: { xs: 0, sm: 2 },
                  "& .MuiFormControlLabel-label": {
                    color: "white",
                    fontSize: "0.85rem",
<<<<<<< HEAD
                    fontStyle: "italic",
=======
>>>>>>> 648f52018e27f82308f8885bc1bbbdf43c1115d2
                  },
                }}
              />

              {/* Close button (right) */}
              <IconButton
                onClick={closeHelp}
                sx={{
                  mt: 1,
                  mr: { xs: 1, sm: 2 },
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.4)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
