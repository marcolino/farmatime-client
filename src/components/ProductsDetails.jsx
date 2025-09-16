import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Grid, Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, Edit, AddShoppingCart } from "@mui/icons-material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { AuthContext } from "../providers/AuthContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useCart } from "../providers/CartProvider";
import { useDialog } from "../providers/DialogContext";
import { isDealer, isOperator } from "../libs/Validation";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import ImageContainer from "./ImageContainer";
import PhoneNumber from "./PhoneNumber";
import config from "../config";

const ProductsDetails = (props) => {
  //const theme = useTheme();
  const { auth, isLoggedIn } = useContext(AuthContext);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarContext();
  const { height } = useWindowDimensions();
  //const [firstRender, setFirstRender] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  //const { showDialog } = useDialog();
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const { isMobile } = useMediaQueryContext();
  const maxImageHeight = height / 2.8;
  const loop = false;

  const swiperRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setFirstRender(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Add limit product if total count > loaded products
  if (props.products.length > 0 && props.productsTotalCount > props.products.length) {
    props.products.push({ limit: true });
  }

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const productEdit = () => {
    navigate(`/edit-product/${currentProduct._id}`);
  };

  const addProductToCart = () => {
    const newCount = addItemToCart(currentProduct);
    showSnackbar(t("Product added to cart ({{count}} products present)", { count: newCount }), "info");
  };

  const currentProduct = props.products[currentIndex];

  return (
    <Box
      sx={{
        cursor: "grab",
        userSelect: "none",
        touchAction: "pan-y",
      }}
    >
      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        initialSlide={0}
        slidesPerView={1}
        loop={loop}
        navigation={false} // Custom navigation buttons below
        allowTouchMove={true}
        style={{ width: "100%" }}
      >
        {props.products.map((product, index) => (
          <SwiperSlide key={index}>
            <ProductDetailsCard product={product} imageHeight={maxImageHeight} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation bar */}
      {props.products.length > 0 && (
        <Grid container sx={{ mt: 2, mx: 0 }}>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
            {config.ecommerce.enabled && !currentProduct.limit && (
              <Tooltip title={t("Add to cart")}>
                <IconButton
                  size="small"
                  onClick={addProductToCart}
                  sx={{
                    borderRadius: 1,
                    px: { xs: 1, sm: 2 },
                    py: 1,
                    margin: 1,
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  <AddShoppingCart fontSize="small" />
                  {!isMobile && (
                    <Typography
                      component={"span"}
                      variant={"caption"}
                      sx={{ pl: 1, fontSize: "1rem", fontWeight: "bold" }}
                    >
                      {t("Add to cart")}
                    </Typography>
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Grid>

          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton aria-label={t("previous page")} disabled={currentIndex === 0 && !loop} onClick={handlePrev}>
              <ArrowLeft fontSize="medium" />
            </IconButton>
            <Typography>
              {t("Page")} {currentIndex + 1} {t("of")} {props.productsTotalCount}
            </Typography>
            <IconButton
              aria-label={t("next page")}
              disabled={currentIndex === props.products.length - 1 && !loop}
              onClick={handleNext}
            >
              <ArrowRight fontSize="medium" />
            </IconButton>
          </Grid>

          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
            {!currentProduct.limit && isLoggedIn && isOperator(auth.user) && (
              <Tooltip title={t("Edit product")}>
                <IconButton
                  size="small"
                  onClick={productEdit}
                  sx={{
                    borderRadius: 1,
                    px: { xs: 1, sm: 2 },
                    py: 1,
                    margin: 1,
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  <Edit fontSize="small" />
                  {!isMobile && (
                    <Typography
                      component={"span"}
                      variant={"caption"}
                      sx={{ pl: 1, fontSize: "1rem", fontWeight: "bold" }}
                    >
                      {t("Edit")}
                    </Typography>
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

const ProductDetailsCard = ({ product, imageHeight }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { height, width } = useWindowDimensions();
  const { auth, isLoggedIn } = useContext(AuthContext);

  const imageUrl = `${config.siteUrl}${config.images.publicPathWaterMark}/${product.imageName}`;

  // Font size scaling helper
  const dynamicFont = (x) => 0.0002896 * x + 0.6214;

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
    { key: t(""), value: "" }, // for layout balance
  ];

  const handleUserJoin = () => {
    navigate("/signin", { replace: true });
  };

  const renderKey = (key) => (
    <Typography
      variant="body1"
      align="left"
      fontWeight="bold"
      sx={{
        bgcolor: "background.paper",
        borderRadius: 1.5,
        px: 1,
        mr: 1,
        fontSize: `${dynamicFont(width)}rem !important`,
        wordBreak: "break-word",
      }}
    >
      {key}
    </Typography>
  );

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <Typography
          key={index}
          variant="body2"
          align="left"
          sx={{ fontSize: `${dynamicFont(width)}rem !important`, wordWrap: "break-word" }}
        >
          {item}
        </Typography>
      ));
    }
    return (
      <Typography variant="body2" align="left" sx={{ fontSize: `${dynamicFont(width)}rem !important`, wordWrap: "break-word" }}>
        {value}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      {/* Show join prompt if product is limited and user not logged in */}
      {product.limit && !isLoggedIn && (
        <Typography sx={{ py: 10, px: 2, margin: 1 }}>
          {t("To access all products, please")}{" "}
          <Button size="small" color="secondary" onClick={handleUserJoin} variant="contained">
            {t("Join !")}
          </Button>
        </Typography>
      )}

      {/* Show dealer role request if limited and logged in but not dealer */}
      {product.limit && isLoggedIn && !isDealer(auth.user) && (
        <Typography sx={{ py: 10, px: 2, margin: 1 }}>
          {t('To access all products, please ask for "dealer" role here:')}{" "}
          <PhoneNumber phoneNumber={config.company.contacts.dealerRoleRequestPhoneNumber} />
        </Typography>
      )}

      {/* Show product details if not limited */}
      {!product.limit && (
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
            <ImageContainer src={imageUrl} alt={t("Product image")} maxHeight={imageHeight} />
          </Box>

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
            <Grid container px={{ xs: 0, sm: 2 }} columnSpacing={{ xs: 0, sm: 2 }} sx={{ justifyContent: "center", alignItems: "center" }}>
              {info.map(({ key, value }, index) => (
                <Grid container key={index} item xs={12} sm={12} md={6} sx={{ justifyContent: "center", alignItems: "center", py: 0.2 }}>
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
