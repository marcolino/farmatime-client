import React from "react";
import { Container, Typography, Card, CardContent, Grid, List, ListItem, ListItemText } from "@material-ui/core";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
//import { Marker } from "react-leaflet";
import IconMarker from "./IconMarker";
//import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import config from "../config";

// import L from "leaflet";
// // fix Leaflet marker icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
// });

const Contacts = () => {
  const { t } = useTranslation();

  return (
    <Container>
      {/* claims section */}
      <Card style={{marginTop: 20, padding: 20}}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {config.company.contacts.claimsTitle}
          </Typography>
          <Typography variant="body1">
          {config.company.contacts.claimsSubtitle}
          </Typography>
        </CardContent>
      </Card>

      {/* map section */}
      <Card style={{marginTop: 20, padding: 20}}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t("Our Location")}
          </Typography>
          <MapContainer center={config.company.contacts.map.center} zoom={config.company.contacts.map.zoom} style={{height: "400px", width: "100%"}}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
            />
            {/* <Marker position={config.company.contacts.map.center}>
              <Popup>
                {t("Our Company is located here")}.
              </Popup>
            </Marker> */}
            <Marker
              position={ config.company.contacts.map.center }
              icon={ IconMarker }
            >
              <Popup>
                {t("Our Company is located here")}.
              </Popup>
            </Marker>
          </MapContainer>
        </CardContent>
      </Card>

      {/* contact section */}
      <Card style={{marginTop: 20, padding: 20}}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t("Contact Us")}
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary={t("Email")} secondary={config.company.mailto} />
            </ListItem>
            <ListItem>
              <ListItemText primary={t("Phone")} secondary={config.company.phone} />
            </ListItem>
            <ListItem>
              <ListItemText primary={t("Address")} secondary={config.company.address} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}

export default React.memo(Contacts);