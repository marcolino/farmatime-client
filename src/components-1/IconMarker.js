import L from "leaflet";

const iconMarker = new L.Icon({
  iconUrl: require("../assets/icons/marker-icon.png"),
  iconRetinaUrl: require("../assets/icons/marker-icon.png"),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: require("../assets/icons/marker-shadow.png"),
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 75),
  className: "leaflet-div-icon"
});

export default iconMarker;