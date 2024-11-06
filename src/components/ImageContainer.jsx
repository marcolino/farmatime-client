import React, { useState } from "react";
import { Box, FormControl, FormLabel } from "@mui/material";

import fallbackImage from "../assets/images/image-not-found.jpg";


const ImageContainer = ({ _src, alt, borderColor = "black", backgroundColor = "lightgray", label, ...props }) => {
  const [imgSrc, setImgSrc] = useState(props.src);

  const handleError = () => {
    if (!imgSrc.endsWith("/")) { // if imgSrc is a folder name, with no image, do not warn, it is the normal case for new images
      console.warn(`image ${imgSrc} not found`);
    }
    setImgSrc(fallbackImage); // switch to the fallback image if the specified image fails to load
  };

  return (
    <FormControl
      variant="outlined"
      sx={{
        position: "relative",
        display: "inline-block",
        width: "100%",
        maxWidth: 800,
      }}
    >
      {label && ( // draw a label similar to MUI TextField
        <FormLabel
          sx={{
            position: "absolute",
            top: -8, // adjust label position above the border
            left: 12, // adjust label position horizontally
            backgroundColor: "background.default",
            px: 1,
            fontSize: "0.875rem !important",
            color: "text.secondary",
            pointerEvents: "none", // prevent label from being interactive
            borderRadius: 0.5,
          }}
        >
          {label.replace(/\.[^/.]+$/, "")} {/* image name without extension */}
        </FormLabel>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
          border: "1px solid", // thin border
          borderColor: borderColor,
          borderRadius: 2, // slightly rounded corners
          backgroundColor, // background color for bars when needed
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={imgSrc}
          alt={alt}
          maxHeight
          onError={handleError}
          sx={{
            maxWidth: props.maxWidth ?? "100%",
            maxHeight: props.maxHeight ?? "100%",
            objectFit: "contain", // ensures the image maintains its aspect ratio without being cropped
            pointerEvents: "none", // avoids user interaction with the image
          }}
        />
      </Box>
    </FormControl>
  );
};

export default ImageContainer;
