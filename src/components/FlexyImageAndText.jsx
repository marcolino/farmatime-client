import React from "react";
import { Box, Container, Typography } from "@mui/material";
import config from "../config";


const FlexyImageAndText = ({ image, imageAlt = null, textTitle = "Title", textContents = "Contents" }) => {
  const height = `calc(100vh - ${config.ui.headerHeight}px - ${config.ui.headerPadding}px - ${config.ui.footerHeight}px - ${config.ui.footerPadding}px)`; // subtract header and footer and padding space heights

  if (!image) {
    console.warn("no image passed to FlexyImageAndText, returning null");
    return null;
  }

  return (
    <Container
      disableGutters
      sx={{
        height,
        display: "flex",
        flexDirection: {
          xs: "column", // stack vertically on small screens
          md: "row", // arrange horizontally on larger screens
        },
      }}
    >
      {/* image section */}
      <Box
        sx={{
          width: {
            xs: "100%", // full width on small screens
            md: "50%", // half width on larger screens
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden", // prevent image overflow
          padding: 2,
        }}
      >
        <Box
          component="img"
          alt={imageAlt}
          src={image}
          sx={{
            maxWidth: "100%", // scale to fit horizontally
            maxHeight: "100%", // scale to fit vertically
            objectFit: "contain", // maintain aspect ratio
          }}
        />
      </Box>

      {/* text section */}
      <Box
        sx={{
          width: {
            xs: "100%", // full width on small screens
            md: "50%", // half width on larger screens
          },
          height: {
            xs: "50%", // full height on small screens
            md: "100%", // half height on larger screens
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          pb: {
            "xs": 12, // to put text a bit upper on xs
          },
          overflow: "hidden", // prevent text overflow
        }}
      >
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
            }}
          >
            {textTitle}
          </Typography>
          <Typography
            variant="body1"
          >
            {textContents}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default React.memo(FlexyImageAndText);
