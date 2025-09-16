import React from "react";
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // fix Leaflet marker icon issue 
import "leaflet/dist/leaflet.css";
import MapMarkerIcon from "../assets/images/MapMarkerIcon.png";
import MapMarkerShadow from "../assets/images/MapMarkerShadow.png";
import config from "../config";

// fix Leaflet marker icon issue 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: MapMarkerIcon,
  iconUrl: MapMarkerIcon,
  shadowUrl: MapMarkerShadow,
});

const Contacts = () => {
  const { t } = useTranslation();
  const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  //const tileLayerContributors = "&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a>";

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
          <MapContainer
            center={config.company.contacts.map.center}
            zoom={config.company.contacts.map.zoom}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url={tileLayerUrl}
            />
            <Marker
              position={config.company.contacts.map.center}
            >
              <Popup>
                {t("Our Company is located here")}.
              </Popup>
            </Marker>
          </MapContainer>
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
              <ListItemText primary={t("Email")} secondary={`mailto:${config.company.email}`} />
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
