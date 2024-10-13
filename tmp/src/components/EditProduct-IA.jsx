import React from "react";
import { Box, Grid, TextField, Button } from "@mui/material";


const EditProduct = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Grid container spacing={2} maxWidth={800}>
        {/* First Column with TextFields */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="First Name" variant="outlined" fullWidth />
            <TextField label="Last Name" variant="outlined" fullWidth />
            <TextField label="Email" variant="outlined" fullWidth />
            <TextField label="Phone" variant="outlined" fullWidth />
            <TextField label="Address" variant="outlined" fullWidth />
          </Box>
        </Grid>

        {/* Second Column with Images and Button */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" flexDirection="column" gap={2} alignItems="center">
            <Box
              component="img"
              src="https://via.placeholder.com/150" // Placeholder image
              alt="Portrait 1"
              sx={{ width: "100%", height: "auto", maxWidth: 200 }}
            />
            <Box
              component="img"
              src="https://via.placeholder.com/150" // Placeholder image
              alt="Portrait 2"
              sx={{ width: "100%", height: "auto", maxWidth: 200 }}
            />
            <Button variant="contained" color="primary">
              Action Button
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(EditProduct);
