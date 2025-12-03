import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/system";
import config from "../config";

const video = `/videos/background/${config.ui.backgroundVideo}.mp4`; // files must be in public/videos/background/
const StyledVideo = styled("video")({
  position: "fixed",
  objectFit: "cover",
  top: 0,
  left: 0,
  minWidth: "100vw",
  minHight: "100vh",
  zIndex: -1,
});

const BackgroundVideo = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // show video only on home page, if it is requested in config.ui.backgroundVideo
  return ((location.pathname === "/") && config.ui.backgroundVideo) ? (
    <StyledVideo autoPlay loop muted>
      <source src={video} type="video/mp4" />
      {/* fallback message */} {t("Sorry, your browser does not support HTML5 video")}.
    </StyledVideo>
  ) : null;
};

export default BackgroundVideo;
