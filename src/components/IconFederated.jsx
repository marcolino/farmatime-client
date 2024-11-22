import React from "react";
import { styled } from "@mui/system";
import { ReactComponent as FacebookSvg } from "../assets/images/FederatedFacebook.svg";
import { ReactComponent as GoogleSvg } from "../assets/images/FederatedGoogle.svg";

// Base style using MUI's styled system
const BaseIconContainer = styled("div")(({ theme }) => ({
  display: "flex",
  width: 20,
  height: 20,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: theme.spacing(0.625), // 5px
  marginRight: theme.spacing(0.625), // 5px
}));

// FacebookIcon container with adjusted width and margin
const FacebookIconContainer = styled(BaseIconContainer)(({ theme }) => ({
  width: 26,
  marginLeft: theme.spacing(0.125), // 1px
}));

// GoogleIcon container with adjusted marginRight
const GoogleIconContainer = styled(BaseIconContainer)(({ theme }) => ({
  marginLeft: theme.spacing(0.125), // 1px
  marginRight: theme.spacing(1.25), // 10px
}));

const FacebookIcon = React.memo(() => (
  <FacebookIconContainer>
    <FacebookSvg />
  </FacebookIconContainer>
));

const GoogleIcon = React.memo(() => (
  <GoogleIconContainer>
    <GoogleSvg />
  </GoogleIconContainer>
));

export { FacebookIcon, GoogleIcon };