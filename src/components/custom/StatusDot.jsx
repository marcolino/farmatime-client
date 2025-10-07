import { Box } from "@mui/material";

const StatusDot = ({ bgcolor }) => {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        ml: 1,
        mr: 1,
        width: 10,
        height: 10,
        borderRadius: "50%",
        bgcolor: bgcolor ?? "black",
      }}
    />
  );
};

export default StatusDot;
