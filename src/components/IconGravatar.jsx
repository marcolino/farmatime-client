import React, { useState } from "react";
import Gravatar from "react-gravatar";

function IconGravatar({
  email,
  size = 32,
  rating = "pg",
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  const defaultImage = "./avatar.png"; // should be in "public" folder

  return (
    <>
      {!imageError ? (
        <Gravatar
          email={email}
          size={size}
          rating={rating}
          default={defaultImage}
          onError={() => setImageError(true)} // set error flag if Gravatar fails
          {...props}
        />
      ) : (
        <img
          src={defaultImage}
          alt="default avatar"
          width={size}
          height={size}
        />
      )}
    </>
  );
}

export default React.memo(IconGravatar);
