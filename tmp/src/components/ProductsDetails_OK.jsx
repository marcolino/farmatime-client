import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { Paper, Grid, Box, Button, Typography } from "@mui/material";
import ImageContainer from "./ImageContainer";
import IconArrowNext from "../assets/icons/ArrowNext.png";
import IconArrowPrev from "../assets/icons/ArrowPrev.png";
import config from "../config";


const ProductsDetails = (props) => {
  const theme = useTheme();
  const [firstRender, setFirstRender] = useState(true);
  const [startPosition, setStartPosition] = useState(null); // to restrict slide to horizontal dragging only
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setFirstRender(false), 100); // delay to ensure first render
    return () => clearTimeout(timer);
  }, []);

  if ((props.products.length > 0) && (props.productsTotalCount > props.products.length)) { // products were limited due lack ot auth
    props.products.push({
      stop: true
    });
  }

  const handleDragStart = (e) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e) => {
    if (!startPosition) return;

    const endPosition = { x: e.clientX, y: e.clientY };
    const deltaX = endPosition.x - startPosition.x;
    const deltaY = endPosition.y - startPosition.y;

    // trigger slide change only for significant horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        const direction = deltaX > 0 ? "left" : "right";
        console.log(`swipe detected: ${direction}`);
        // add logic to handle slide navigation based on direction
    }

    setStartPosition(null);

    // check for significant horizontal swipes only
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const newIndex = deltaX > 0 
        ? Math.max(currentIndex - 1, 0) // swipe right (move to the previous slide)
        : Math.min(currentIndex + 1, props.products.length - 1); // swipe left (move to the next slide)

      setCurrentIndex(newIndex);
    }

    // Rereset the starting position
    setStartPosition(null);
  };

  return (
    // <div {...swipeHandlers}>
    <div
      style={{ cursor: 'grab' }}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0])}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0])}
    >
      <Carousel
        autoPlay={false}
        //animation={"none"} //{"slide"}
        animation={firstRender ? "none" : "slide"} // disable animation for the first render
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
            justifyContent: "space-between", // align buttons on opposite sides
            alignItems: "center", // center buttons vertically in their container
            padding: theme.spacing(2), // add spacing
            flexDirection: "row", // arrange in a row
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
  )
}

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
              <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
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
