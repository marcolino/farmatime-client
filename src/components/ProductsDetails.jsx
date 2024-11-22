import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { Paper, Grid, Box, Button, Typography } from "@mui/material";
import ImageContainer from "./ImageContainer";
import IconArrowNext from "../assets/images/ArrowNext.png";
import IconArrowPrev from "../assets/images/ArrowPrev.png";
import config from "../config";


const ProductsDetails = (props) => {
  const theme = useTheme();
  const [firstRender, setFirstRender] = useState(true);
  const [startPosition, setStartPosition] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setFirstRender(false), 100);
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

    e.preventDefault();
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

  return (
    <div
      style={{ 
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        touchAction: "pan-y",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
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
        navButtonsAlwaysVisible={true}
        cycleNavigation={false}
        navButtonsProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 12,
            opacity: 0.3,
            margin: "0"
          },
        }}
        navButtonsWrapperProps={{
          sx: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: theme.spacing(2),
            flexDirection: "row",
          },
        }}
        PrevIcon={<img src={IconArrowPrev} width="32" alt="previous product" />}
        NextIcon={<img src={IconArrowNext} width="32" alt="next product" />}
      >
        {props.products.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </Carousel>
    </div>
  );
};

const Product = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const info = [
    { key: t("MDA code"), value: props.product.mdaCode },
    { key: t("OEM code"), value: props.product.oemCode },
    { key: t("Type"), value: props.product.type },
    { key: t("Make"), value: props.product.make },
    { key: t("Models"), value: props.product.models },
    { key: t("Application"), value: props.product.application },
    { key: t("kW"), value: props.product.kw },
    { key: t("Volt"), value: props.product.volt },
    { key: t("Ampere"), value: props.product.ampere },
    { key: t("Teeth"), value: props.product.teeth },
    { key: t("Rotation"), value: props.product.rotation },
    { key: t("Regulator"), value: props.product.regulator },
    { key: t("Notes"), value: props.product.notes },
  ];

  const handleUserJoin = (event) => {
    navigate("/signin", { replace: true });
  };

  return (
    <Paper
      sx={{
        minHeight: config.ui.products.cards.minHeight, // minimum paper height for images of max height
        padding: 2,
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sx={{ padding: 1 }}>
          {props.product.stop && (
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
          {!props.product.stop && (
            <>
              <ImageContainer
                src={`${config.siteUrl}${config.images.publicPathWaterMark}/${props.product.imageName}`}
                alt={t("Product image")}
                maxHeight={`${config.ui.products.images.minHeight}px`}
                borderColor="transparent"
                backgroundColor="background.default"
              />
              <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
                <Grid
                  container
                  rowSpacing={0} // Vertical spacing between items
                  maxWidth={800} // Optional: set a max width to control content width
                >
                  {info.map(({ key, value }, index) => (
                    <Grid
                      item
                      key={index}
                      xs={12} // full width on extra-small screens (one column)
                      sm={6} // half width on small and larger screens (two columns)
                    >
                      <Box display="flex" alignItems="center">
                        <Typography variant="body1" color="textSecondary" sx={{ marginRight: 0.5 }}>
                          {key}:
                        </Typography>
                        <Typography variant="body1">{value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default React.memo(ProductsDetails);
