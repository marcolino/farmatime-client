import React, { useState, useRef, useEffect } from "react";
import { Typography, Box, IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";


const TypographyExpandable = ({ text, maxLines = 2, animationDuration = 300 }) => {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef();

  // check if the text overflows to show ellipsis
  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollHeight > textRef.current.offsetHeight);
    }
  }, [text, maxLines]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Box position="relative" sx={{ width: "100%" }}>
      <Typography
        ref={textRef}
        variant="body2"
        sx={{
          overflow: "hidden",
          display: expanded ? "block" : "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "none" : maxLines,
          whiteSpace: expanded ? "normal" : "nowrap",
          textOverflow: "ellipsis",
          transition: `all ${animationDuration}ms ease`,
          position: "relative",
        }}
      >
        {text}
        {/* "show more" button */}
        {!expanded && isTruncated && (
          <IconButton
            size="small"
            onClick={handleToggle}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              padding: 0,
              backgroundColor: "transparent",
              color: "primary.main",
            }}
          >
            <MoreHorizIcon />
          </IconButton>
        )}
      </Typography>

      {/* "show less" button */}
      {expanded && (
        <Box sx={{ textAlign: "right", mt: 1 }}>
          <IconButton
            size="small"
            onClick={handleToggle}
            sx={{
              padding: 0,
              backgroundColor: "transparent",
              color: "primary.main",
            }}
          >
            <ExpandLessIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(TypographyExpandable);
