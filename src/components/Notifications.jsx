import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
//import red from "@mui/material/colors/red";
import { PushNotificationsStatusContext } from "../providers/PushNotificationsStatusContext";
import { i18n }  from "../i18n";


const /*function*/ Notifications = (props) => {
  const { status, setStatus } = useContext(PushNotificationsStatusContext);
  const navigate = useNavigate();
  const classes = {};

  const deleteForeverMessage = (index) => {
    setStatus({pushNotifications: status.pushNotifications.filter((notification, i) =>
      i !== index
    )});
    if (status.pushNotifications.length <= 1) { // setStatus is asynchronous...
      navigate(-1);
    }
  };
  
  // console.log("Notifications - status.pushNotifications:", status?.pushNotifications);
  // console.log("Notifications - props.location.state:", props?.location?.state);

  return (
    <div className={classes.root}>
      {status?.pushNotifications.map((state, index) => {
        //console.log("Notifications state:", state);
        const timestamp = state.data["google.c.a.ts"];
        const when = new Intl.DateTimeFormat( // TODO: try to avoid Intl usage...
          i18n.language, // i18n.language is ISO 639-1
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            //second: "2-digit",
          }
        ).format(timestamp * 1000); // milliseconds required
        return (
          <Card key={index} className={classes.root}>

            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "red" }} src={state.notification.image} aria-label="notification avatar" />
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={state.notification.title}
              subheader={when}
            />

            <CardContent>
              <img src={state.notification.image} alt="test" style={{maxHeight: 300, maxWidth: 300}} />
            </CardContent>

            <CardContent>
              <Typography variant="body2" color="textSecondary" component="div" /* "p" */>
                {state.notification.body}
              </Typography>
            </CardContent>

            <CardActions>
              <IconButton aria-label="share">
                <ShareIcon /> {/* TODO: handle share */}
              </IconButton>
              <IconButton aria-label="delete forever" onClick={() => deleteForeverMessage(index)} >
                <DeleteForeverIcon /> {/* TODO: handle delete forever */}
              </IconButton>
            </CardActions>

          </Card>
        )
      })}
    </div>
  );
}

export default React.memo(Notifications);