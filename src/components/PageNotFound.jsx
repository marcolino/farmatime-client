import React from "react";
import { Box, Container, Typography } from "@mui/material";
//import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import PageNotFoundImage from "../assets/images/PageNotFound.png";
import config from "../config";


const PageNotFound = () => {
  const { t } = useTranslation();
  //const theme = useTheme();

  return <NoScrollComponent t={t} PageNotFoundImage={PageNotFoundImage} />;
}

const NoScrollComponent = ({ t, PageNotFoundImage }) => {
  const height = `calc(100vh - ${config.ui.headerHeight}px - ${config.ui.headerPadding}px - ${config.ui.footerHeight}px - ${config.ui.footerPadding}px)`; // subtract header and footer and padding space heights

  return (
    <Container
      disableGutters
      sx={{
        height,
        display: "flex",
        flexDirection: {
          xs: "column", // stack vertically on small screens
          md: "row", // arrange horizontally on larger screens
        },
      }}
    >
      {/* image section */}
      <Box
        sx={{
          width: {
            xs: "100%", // full width on small screens
            md: "50%", // half width on larger screens
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden", // prevent image overflow
          padding: 2,
        }}
      >
        <Box
          component="img"
          alt={t("Page not found image")}
          src={PageNotFoundImage}
          sx={{
            maxWidth: "100%", // scale to fit horizontally
            maxHeight: "100%", // scale to fit vertically
            objectFit: "contain", // maintain aspect ratio
          }}
        />
      </Box>

      {/* text section */}
      <Box
        sx={{
          width: {
            xs: "100%", // full width on small screens
            md: "50%", // half width on larger screens
          },
          height: {
            xs: "50%", // full height on small screens
            md: "100%", // half height on larger screens
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          overflow: "hidden", // prevent text overflow
        }}
      >
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
            }}
          >
            {t("Oooops!")}
          </Typography>
          <Typography
            variant="body1"
          >
            {t("I've lost the page you did request! Sorry…")}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default React.memo(PageNotFound);
