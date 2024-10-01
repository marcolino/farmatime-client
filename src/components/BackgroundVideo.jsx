import React from "react";
//import video from "../assets/videos/steam.mp4";
import "./BackgroundVideo.css"; // create a separate CSS file for styles if needed
import config from "../config";


const BackgroundVideo = () => {
  return config.ui.backgroundVideo ? (
    <div className="videoContainer">
      <video className="videoPlayer" autoPlay loop muted>
        <source src={`/video/${config.ui.backgroundVideo}.mp4`} type="video/mp4" />
        {/* <source src={video} type="video/mp4" /> */}
        {/* fallback message */}
        Sorry, your browser does not support HTML5 video.
      </video>
    </div>
  ) : null;
};

export default BackgroundVideo;
