import React from "react";
import PropTypes from "prop-types";
import IconLogoMain from "../assets/images/LogoMain.png";
import IconNetworkOn from "../assets/images/Network.on.svg";
import IconNetworkOff from "../assets/images/Network.off.svg";
import IconNotFound from "../assets/images/PageNotFound.png";
import IconWorkInprogress from "../assets/images/WorkInProgress.png";


//function IconCustom(props) {
function IconCustom({ name, size = 32, style = {}, alt = "icon", ...props }) {
  let icon;
  switch (name) {
    case "LogoMain": icon = IconLogoMain; break;
    case "Network.on": icon = IconNetworkOn; break;
    case "Network.off": icon = IconNetworkOff; break;
    case "NotFound": icon = IconNotFound; break;
    case "WorkInProgress": icon = IconWorkInprogress; break;
    default: icon = "#"; break;
  }

  return (
    <img src={icon} style={style} width={size} height={size} alt={`${alt ? alt : name}`} {...props} />
  );    
};

IconCustom.propTypes = {
  name: PropTypes.oneOf([
    "LogoMain",
    "Network.on",
    "Network.off",
    "NotFound",
    "WorkInProgress",
  ]).isRequired,
  size: PropTypes.number,
  style: PropTypes.object,
  alt: PropTypes.string,
};

// IconCustom.defaultProps = {
//   size: 32,
//   style: {},
//   alt: "icon",
// };


export default React.memo(IconCustom);