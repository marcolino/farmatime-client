import React from "react";
import { Container, Card, CardContent,/* Box,*/ Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
//import { ErrorOutline } from "@mui/icons-material";
import config from "../config";


const ErrorMessage = ({ message = "An error occurred" }) => {
  return (
    <Container>
      {/* claims section */}
      <Card style={{ marginTop: 20, padding: 20 }}>
        <CardContent>
          <Typography variant="h6" component="p"
            sx={{
              color: "error.main", 
              whiteSpace: "pre-line",
              fontWeight: "bold",
            }}
          >
            {message}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );

  const height = `calc(100vh - ${config.ui.headerHeight}px - ${config.ui.headerPadding}px - ${config.ui.footerHeight}px - ${config.ui.footerPadding}px)`; // subtract header and footer and padding space heights

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={height}
      width="100%"
      sx={{ 
        maxWidth: { xs: "90%", sm: "600px", md: "800px", lg: "1000px", xl: "1200px" }, // responsive max width
        margin: "0 auto", // center the component horizontally
        color: "error.main", 
        textAlign: "center" 
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="h6" component="p" sx={{
        whiteSpace: "pre-line", fontWeight: "bold" }}>
        {message}
      </Typography>
    </Box>
  );
};

export default ErrorMessage;
