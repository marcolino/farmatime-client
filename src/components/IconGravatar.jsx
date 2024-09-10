import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Gravatar from "react-gravatar";


function IconGravatar({ email, size = 32, style, className }, ...props) {
  // const styles = theme => ({
  //   customAvatarIcon: {
  //   },
  // });
  // const useStyles = makeStyles((theme) => (styles(theme)));
  // const classes = useStyles();

  return (
    <Gravatar
      email={email}
      size={size}
      style={style}
      //className={className ? className : classes.customAvatarIcon}
    />
  );    
};

IconGravatar.propTypes = {
  email: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
};

// IconGravatar.defaultProps = {
//   size: 32,
// };

export default React.memo(IconGravatar);