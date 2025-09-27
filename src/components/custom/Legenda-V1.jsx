import React from "react";
import { Stack, Typography, Paper, Chip } from "@mui/material";

const LegendItem = ({ color, label }) => {
  console.log(color, label);
  return (
    <Stack direction="row" spacing={0} alignItems="center">
      <Chip
        label={label}
        size="small"
        sx={{
          color: "white",
          backgroundColor: color,
          height: 'auto',           // allow custom height
          minHeight: 0, 
          mt: 0.5,
          '& .MuiChip-label': {
            px: 1.5,
            paddingTop: 0.3,
            paddingBottom: 0.5,
            lineHeight: 0.9,    
          },
        }}
      />
    </Stack>
  );
};

const Legenda = ({ title, items }) => {
  return (
    <Paper sx={{
      position: "relative",
      p: 1.5,
      display: "inline-block",
      bgcolor: "background.paper",
    }}>
      <Paper
        variant="outlined"
        sx={{
          position: "relative",
          p: 1.5,
          display: "inline-block",
        }}
      >
        {title && (
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
        )}

        <Stack direction="row" spacing={1} alignItems="center">
          {items.filter(item => item.label).map((item) => (
            <LegendItem key={item.label} {...item} />
          ))}
        </Stack>
      </Paper>
    </Paper>
  );
};

export default React.memo(Legenda);
