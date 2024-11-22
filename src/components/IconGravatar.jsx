import React, { useState } from "react";
import Gravatar from "react-gravatar";
import imageDefault from "../assets/images/Avatar.png";

function IconGravatar({
  email,
  size = 32,
  rating = "pg",
  ...props
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <>
      {!imageError ? (
        <Gravatar
          email={email}
          size={size}
          rating={rating}
          default={imageDefault}
          onError={() => setImageError(true)} // set error flag if Gravatar fails
          {...props}
        />
      ) : (
        <img
          src={imageDefault}
          alt="default avatar"
          width={size}
          height={size}
        />
      )}
    </>
  );
}

export default React.memo(IconGravatar);
