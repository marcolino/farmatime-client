import React from "react";
import PropTypes from "prop-types";


function ImageCustom({ src, size = 32, style = { }, alt = "icon" }, ...props) {
  return (
    <img src={src} style={style} width={size} height={size} alt={props.alt} {...props} />
  );    
};

export default React.memo(ImageCustom);
