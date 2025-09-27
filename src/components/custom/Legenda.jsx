import React from "react";
import { Typography, Paper, Chip, Box, Tooltip } from "@mui/material";

const LegendItem = ({ color, label }) => {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        color: "white",
        backgroundColor: color,
        height: "auto",
        minHeight: 0,
        mt: 0.5,
        '& .MuiChip-label': {
          px: 1.5,
          pt: 0.3,
          pb: 0.5,
          lineHeight: 0.9,
        },
      }}
    />
  );
};

const Legenda = ({ title, items }) => {
  return (
    <Tooltip title={title}>
      <Paper
        sx={{
          position: "relative",
          p: 1.5,
          mt: 2,
          display: "inline-block",
          bgcolor: "background.paper",
        }}
      >
        {/* <Paper
          variant="outlined"
          sx={{
            position: "relative",
            p: 1.5,
            display: "inline-block",
          }}
        > */}
          {/* {title && (
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: -12,
                left: 12,
                px: 0.5,
                bgcolor: "background.paper",
              }}
            >
              {title}
            </Typography>
          )} */}

          {/* Wrapable container */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
            }}
          >
            {items
              .filter((item) => item.label)
              .map((item) => (
                <LegendItem key={item.label} {...item} />
              ))}
          </Box>
        {/* </Paper> */}
      </Paper>
    </Tooltip>
  );
};

export default React.memo(Legenda);
