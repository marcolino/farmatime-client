import { useContext, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { HelpContext } from "../providers/HelpContext";

export default function HelpVideoDialog() {
  const { open, closeHelp } = useContext(HelpContext);
  const videoRef = useRef(null);

  // Try autoplay when dialog opens
  useEffect(() => {
    if (open && videoRef.current) {
      const v = videoRef.current;
      const playAttempt = v.play();
      if (playAttempt !== undefined) {
        playAttempt.catch(() => {
          // Autoplay blocked — show controls so user can start manually
          v.controls = true;
        });
      }
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={closeHelp}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          overflow: "hidden",   // ❗ prevents scrollbar
          borderRadius: 3,
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          //backgroundColor: "white",
        }}
      >
        <video
          ref={videoRef}
          src="/videos/presentation-it.mp4"
          controls
          autoPlay
          playsInline
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            maxHeight: "90vh", // prevents tall container
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
