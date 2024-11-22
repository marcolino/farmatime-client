import React, { useContext } from "react";
import { Container, Box, Typography, Card, CardContent, List, ListItem, ListItemText } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
//import { OnlineStatusContext } from "../providers/OnlineStatusProvider";
//import MapForOfflineModeImage from "../assets/images/MapForOfflineMode.png";
import config from "../config";

// we try to avoid using this fix, hoping issue is solved on library...
import L from "leaflet";
// fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const Contacts = () => {
  //const isOnline = useContext(OnlineStatusContext);
  const { t } = useTranslation();

  return (
    <Container>
      {/* claims section */}
      <Card style={{ marginTop: 20, padding: 20 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t("Our Company Claim")}
          </Typography>
          <Typography variant="body1">
            {t("We provide the best services in the industry, focusing on quality and customer satisfaction")}.
          </Typography>
        </CardContent>
      </Card>

      {/* map section */}
      <Card style={{ marginTop: 20, padding: 20 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t("Our Location")}
          </Typography>
          {/* {isOnline ? ( // no need to show a static image when offline, maps are cached too */}
            <MapContainer center={config.company.contacts.map.center} zoom={config.company.contacts.map.zoom} style={{ height: "400px", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
              />
              <Marker
                position={config.company.contacts.map.center}
              >
                <Popup>
                  {t("Our Company is located here")}.
                </Popup>
              </Marker>
            </MapContainer>
          {/* ) : (
            <>
              <Box
                component="img"
                sx={{ objectFit: "contain" }}
                alt="Map static image (offline)"
                src={MapForOfflineModeImage}
              />
            </>
          )} */}
        </CardContent>
      </Card>

      {/* contact section */}
      <Card style={{ marginTop: 20, padding: 20 }}>
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
