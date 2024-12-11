import React, { useState, useEffect, useContext } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Carousel from "react-material-ui-carousel";
import { Grid, Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { AuthContext } from "../providers/AuthProvider";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import ImageContainer from "./ImageContainer";
import config from "../config";


const ProductsDetails = (props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const [firstRender, setFirstRender] = useState(true);
  const [startPosition, setStartPosition] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const maxImageHeight = height / 2.8; // maximum image height, and details card height
  const cycle = false;

  useEffect(() => {
    const timer = setTimeout(() => setFirstRender(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if ((props.products.length > 0) && (props.productsTotalCount > props.products.length)) {
    props.products.push({
      stop: true
    });
  }

  const handleDragStart = (e) => {
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    setStartPosition({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (!startPosition) return;

    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - startPosition.x;
    const deltaY = Math.abs(clientY - startPosition.y);

    if (deltaY > Math.abs(deltaX)) {
      setStartPosition(null);
      setIsDragging(false);
      return;
    }
    //e.preventDefault();
  };

  const handleDragEnd = (e) => {
    if (!startPosition) return;

    const clientX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.type === "touchend" ? e.changedTouches[0].clientY : e.clientY;

    const deltaX = clientX - startPosition.x;
    const deltaY = Math.abs(clientY - startPosition.y);

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (deltaX < 0 && currentIndex < props.products.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }

    setStartPosition(null);
    setIsDragging(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? (cycle ? props.products.length - 1 : prev) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === props.products.length - 1 ? (cycle ? 0 : prev) : prev + 1));
  };

  return (
    <Box
      sx={{ 
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        touchAction: "none", // was: "pan-y",
      }}
      onMouseDown={(e) => {
        //e.preventDefault(); // WARNING: with this code, the first touch on next product icon, search input is focused, forcing a scroll up, which is not wanted...
        handleDragStart(e);
      }}
      onMouseMove={(e) => {
        if (isDragging) {
          handleDragMove(e);
        }
      }}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <Carousel
        index={currentIndex}
        onChange={(index) => setCurrentIndex(index)}
        autoPlay={false}
        animation={firstRender ? "none" : "slide"}
        swipe={false}
        indicators={false}
        navButtonsAlwaysInvisible={true}
        cycleNavigation={false}
        sx={{
          "& .MuiPaper-root": {
            overflow: "hidden"
          },
          "& img": {
            width: "100%",
            height: "auto",
            objectFit: "contain"
          }
        }}
      >
        {props.products.map((product, index) => (
          <ProductDetailsCard key={index} product={product} imageHeight={maxImageHeight} />
        ))}
      </Carousel>

       {/* navigation bar */}
      <Box sx={{
        display: "flex",
        justifyContent: "center", 
        alignItems: "center", // vertical align
        gap: 1, // adds some spacing between the elements
      }}>
        <IconButton aria-label={t("previous page")} disabled={ (currentIndex === 0 && !cycle) } /*size="small"*/
          onClick={handlePrev}>
          <ArrowLeft fontSize="medium" />
        </IconButton>
        <Typography sx={{ py: 0, my: 0}}>
          {t("Page")} {1 + currentIndex} {t("of")} {props.productsTotalCount}
        </Typography>
        <IconButton aria-label={t("next page")} disabled={ (currentIndex === props.products.length - 1 && !cycle) } /*size="small"*/
          onClick={handleNext}>
          <ArrowRight fontSize="medium" />
        </IconButton>
      </Box>

    </Box>
  );
};


const ProductDetailsCard = ({ product, imageHeight }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { height, width } = useWindowDimensions();
  const { auth, isLoggedIn } = useContext(AuthContext);
  const imageUrl = `${config.siteUrl}${config.images.publicPathWaterMark}/${product.imageName}`;
  const dynamicFont = (x) => (0.0002896 * x) + 0.6214; //  transform 1652 to 1.1, and 375 to 0.73

  const info = [
    { key: t("MDA code"), value: product.mdaCode },
    { key: t("OEM code"), value: product.oemCode },
    { key: t("Type"), value: product.type },
    { key: t("Make"), value: product.make },
    { key: t("Models"), value: product.models },
    { key: t("Application"), value: product.application },
    { key: t("kW"), value: product.kw },
    { key: t("Volt"), value: product.volt },
    { key: t("Ampere"), value: product.ampere },
    { key: t("Teeth"), value: product.teeth },
    { key: t("Rotation"), value: product.rotation },
    { key: t("Regulator"), value: product.regulator },
    { key: t("Notes"), value: product.notes },
    { key: t(""), value: "" }, // if count was odd
  ];

  const renderKey = (key) => {
    return (
      <Typography variant="body1" align="left" fontWeight="bold"
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 1.5,
          px: 1,
          mr: 1,
          fontSize: `${dynamicFont(width)}rem !important`,
          wordBreak: "break-all"
        }}>
        {key}
      </Typography>
    );
  };
  
  const renderValue = (value) => {
    const val = (value, index = 0) => (
      <Typography key={index} variant="body2" align="left" sx={{
        fontSize: `${dynamicFont(width)}rem !important`,
        wordWrap: "break-all",
      }}>
        {value}
      </Typography>
    );
    if (Array.isArray(value)) {
      return value.map((item, index) => val(item, index));
    }
    return val(value);

  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      border: "1px solid #ddd",
      borderRadius: 2,
    }}>
      {product.stop && !isLoggedIn && (
        <Typography>
          {t("To access all products, please")}{" "}
          <Button
            size="small"
            color="secondary"
            onClick={handleUserJoin}
            variant="contained"
          >
            {t("Join !")}
          </Button>
        </Typography>
      )}
      {product.stop && isLoggedIn && !isDealer(auth.user) && (
        <Typography>
          {t("To access all products, please ask for \"dealer\" role here: {{dealerRoleRequest}}", { dealerRoleRequest: config.company.contacts.dealerRoleRequest })}{" "}
        </Typography>
      )}
      {/* top section: product image */}
      {!product.stop && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              justifyContent: "center",
              minHeight: imageHeight,
              py: 1,
            }}
          >
            <ImageContainer
              src={imageUrl}
              alt={t("Product image")}
              maxHeight={imageHeight}
            />
          </Box>

          {/* bottom section: product details */}
          <Box
            sx={{
              maxHeight: imageHeight,
              justifyContent: "center",
              alignItems: "center",
              overflowY: "auto",
              padding: 1,
              my: 1,
            }}
          >
            <Grid container px={{ xs: 0, sm: 2 }} columnSpacing={{ xs: 0, sm: 2 }}
              sx={{justifyContent: "center", alignItems: "center"}}>
              {info.map(({ key, value }, index) => (
                <Grid container key={index} item xs={12} sm={12} md={6}
                  sx={{ justifyContent: "center", alignItems: "center", py: 0.2 }}
                >
                  <Grid item xs={4}>
                    {renderKey(key)}
                  </Grid>
                  <Grid item xs={8} sx={{ flexWrap: "wrap" }}>
                    {renderValue(value)}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )} 
    </Box>
  );
};

export default React.memo(ProductsDetails);
