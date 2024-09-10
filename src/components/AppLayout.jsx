import React from "react";
import { Container, CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";

const AppContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "start",
  padding: theme.spacing(2),
}));

function AppLayout({ children }) {
  return (
    <>
      <CssBaseline />
      <AppContainer>
         {/* maxWidth="lg"> */}
        {children}
      </AppContainer>
    </>
  );
}

export default AppLayout;
