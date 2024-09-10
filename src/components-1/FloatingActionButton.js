import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, lightColors, darkColors } from "react-floating-action-button";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { StatusContext } from "../providers/StatusProvider";



function FloatingActionButton(props) {
  const { status } = useContext(StatusContext);
  const location = useLocation();
  const navigate = useNavigate();

  const showingNotifications = (location.pathname === "/notifications");
  const show = (status.pushNotifications.length && !showingNotifications);

  const link = props.link ? props.link : {
    pathname: "/notifications",
    //search: "?query=abc",
    state: status.pushNotifications,
  };

  const action = () => {
    navigate(link);
  };

  return show ? (
    <Container>
      <Button
        rotate={true}
        onClick={action}
        styles={{backgroundColor: darkColors.lighterRed, color: lightColors.white}}
      >
        <NotificationsActiveIcon />
        <span style={{position: "relative", bottom: "-0.8em", fontSize: "90%", fontWeight: "bold"}}>
          {status.pushNotifications.length > 1 ? status.pushNotifications.length : null}
        </span>
      </Button>
    </Container>
  ) : null
}

export default React.memo(FloatingActionButton);
