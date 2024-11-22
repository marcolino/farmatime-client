import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Paper, Grid, Box, Button, Typography } from "@mui/material";
import ImageContainer from "./ImageContainer";
import IconArrowNext from "../assets/icons/ArrowNext.png";
import IconArrowPrev from "../assets/icons/ArrowPrev.png";
import config from "../config";

//const SWIPE_SENSITIVITY = 275;

const ProductsDetails = (props) => {
  const theme = useTheme();
  const [firstRender, setFirstRender] = useState(true);
  // const [startPosition, setStartPosition] = useState(null); // to restrict slide to horizontal dragging only
  // const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setFirstRender(false), 100); // delay to ensure first render
    return () => clearTimeout(timer);
  }, []);

  if ((props.products.length > 0) && (props.productsTotalCount > props.products.length)) { // products were limited due lack ot auth
    props.products.push({
      stop: true
    });
  }

  const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
    },
  };

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-prev slick-arrow" +
        (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      <img src={IconArrowPrev} width="32" alt="previous product" />
    </button>
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-next slick-arrow" +
        (currentSlide === slideCount - 1 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      <img src={IconArrowNext} width="32" alt="next product" />
    </button>
  );
  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    //arrows: true,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    // nextArrow: <({ currentSlide, slideCount, ...props }) => (
    //   <img src={IconArrowNext} width="32" alt="next product" />
    // ) />,
    // prevArrow: ({ currentSlide, slideCount, ...props }) => (
    //   <img src={IconArrowPrev} width="32" alt="previous product" />
    // ),
  };

  return (
    <Carousel responsive={responsive} swipeable draggable>
      {props.products.map((product, index) => (
        // <div key={index} style={{ textAlign: "center", padding: "20px", color: "white" }}>
        //   <img
        //     // src={product.image}
        //     src={`${config.siteUrl}${config.images.publicPathWaterMark}/${product.imageName}`}
        //     alt={product.name}
        //     style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
        //   />
        //   <h3>{product.oemCode}</h3>
        //   <p>{product.notes}</p>
        // </div>
        <Product key={index} product={product} />
      ))}
    </Carousel>
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
