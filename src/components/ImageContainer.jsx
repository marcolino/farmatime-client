import React, { useState, useEffect } from "react";
import { Box, FormLabel } from "@mui/material";

import fallbackImage from "../assets/images/ImageNotFound.jpg";


const ImageContainer = ({ _src, alt, borderColor = "transparent", bgColor = "transparent", label, ...props }) => {
  const [imgSrc, setImgSrc] = useState(props.src);

  if (!imgSrc) {
    setImgSrc(fallbackImage); // switch to the fallback image if the specified image fails to load
  }

  const handleError = () => {
    if (!imgSrc.endsWith("/undefined") && !imgSrc.endsWith("/")) { // if imgSrc is a folder name, with no image, do not warn, it is the normal case for new images
      console.warn(`image ${imgSrc} not found`);
    }
    setImgSrc(fallbackImage); // switch to the fallback image if the specified image fails to load
  };

  return (
    <Box>
      {label && ( // draw a label similar to MUI TextField
        <FormLabel
          sx={{
            position: "absolute",
            top: -8, // adjust label position above the border
            left: 12, // adjust label position horizontally
            bgColor: "background.default",
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
          overflow: "hidden",
          border: "1px solid", // thin border
          borderRadius: 2, // slightly rounded corners
          borderColor,
        }}
      >
        <Box
          component="img"
          src={imgSrc}
          alt={alt}
          //maxHeight
          onError={handleError}
          sx={{
            maxWidth: props.maxWidth ?? "100%",
            maxHeight: props.maxHeight ?? "100%",
            objectFit: "contain", // ensures the image maintains its aspect ratio without being cropped
            pointerEvents: "none", // avoids user interaction with the image
            //borderRadius: 2, // ensures the image itself has rounded corners
          }}
        />
      </Box>
    </Box>
  );
};

export default ImageContainer;
