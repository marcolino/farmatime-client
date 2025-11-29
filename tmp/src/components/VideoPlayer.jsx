import React, { useRef } from "react";
//import { Card, CardHeader, CardContent } from "@mui/material";

const VideoPlayer = ({
  src,
  width = "100%",
  height = "auto",
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  onPlay,
  onPause,
  onEnded,
}) => {
  const videoRef = useRef(null);

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
        //background: "#000",  // visible behind letterboxing
      }}
    >
      <video
        ref={videoRef}
        src={src}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        style={{
          width,
          height,
          maxHeight: "52dvh",
          objectFit: "contain",
          display: "block",
          //background: "transparent",
        }}
      />
    </div>
  );
}

export default React.memo(VideoPlayer);
