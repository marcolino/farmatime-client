import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import Carousel from "react-material-ui-carousel";
import { Grid, Box, Button, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { ArrowLeft, ArrowRight, Edit, ShoppingCart } from "@mui/icons-material";
//import CustomIconButton from "./custom/IconButton";
import { AuthContext } from "../providers/AuthProvider";
import { useDialog } from "../providers/DialogProvider";
import { isDealer, isOperator } from "../libs/Validation";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import ImageContainer from "./ImageContainer";
import PhoneNumber from "./PhoneNumber";
import config from "../config";


const ProductsDetails = (props) => {
  const theme = useTheme();
  const { auth, isLoggedIn } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const [firstRender, setFirstRender] = useState(true);
  const [startPosition, setStartPosition] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { showDialog } = useDialog();
  const navigate = useNavigate();
  // const { productId: productIdFromParams } = useParams();
  // const [productId] = useState(productIdFromParams || null);
  const maxImageHeight = height / 2.8; // maximum image height, and details card height - TODO: put in config/app/products/carousel/viewportHeightRatio
  const loop = false; // TODO: put in config/app/products/carousel/loop

    
  useEffect(() => { // disable animation for first render
    const timer = setTimeout(() => setFirstRender(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (props.products.length > 0 && props.productsTotalCount > props.products.length) {
    props.products.push({ limit: true });
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
    const deltaX = clientX - startPosition.x;
    const deltaY = Math.abs(e.type === "touchmove" ? e.touches[0].clientY : e.clientY - startPosition.y);
    if (deltaY > Math.abs(deltaX)) {
      setStartPosition(null);
      setIsDragging(false);
    }
  };

  const handleDragEnd = (e) => {
    if (!startPosition) return;
    const clientX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
    const deltaX = clientX - startPosition.x;

    if (Math.abs(deltaX) > 50) {
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
    setCurrentIndex((prev) => (prev === 0 ? (loop ? props.products.length - 1 : prev) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === props.products.length - 1 ? (loop ? 0 : prev) : prev + 1));
  };

  const editProduct = () => {

  };

  const buyProduct = () => {
    if (!isLoggedIn) {
      showDialog({
        title: t("Access to buy"),
        message: t("Please access before buying"),
        confirmText: t("Access"),
        cancelText: t("Cancel"),
        onConfirm: () => navigate(`/signin/cart/${currentProduct._id}`),
        onCancel: () => { },
      });
    } else {
      navigate(`/cart/${currentProduct._id}`);
    }
  };

  //const productId = currentIndex; // TODO...
  const currentProduct = props.products[currentIndex];

  return (
    <Box
      sx={{
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
      onMouseDown={handleDragStart}
      onMouseMove={isDragging ? handleDragMove : null}
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
        navButtonsAlwaysInvisible
        loopNavigation={false}
        sx={{
          "& .MuiPaper-root": {
            overflow: "hidden",
          },
          "& img": {
            width: "100%",
            height: "auto",
            objectFit: "contain",
          },
        }}
      >
        {props.products.map((product, index) => (
          <ProductDetailsCard key={index} product={product} imageHeight={maxImageHeight} />
        ))}
      </Carousel>

      {/* navigation bar */}
      {props.products.length > 0 && (
        <Grid container sx={{ mt: 2, mx: {xs: 0, sm: 3}}}>
          <Grid item xs={2}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {!currentProduct.limit &&
              <Tooltip title={t("Buy product")}>
                <IconButton
                  size="small"
                  onClick={() => buyProduct()}
                  sx={{
                    borderRadius: 1,
                    px: { xs: 1, sm: 2, },
                    py: 1,
                    margin: 1,
                    backgroundColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.dark", // slightly darker on hover
                    },
                  }}
                >
                  <ShoppingCart fontSize="small" />
                  {!isMobile && <Typography component={"span"} variant={"caption"} sx={{ pl: 1, fontSize: "1rem", fontWeight: "bold"}}> {t("Buy!")} </Typography>}
                </IconButton>
              </Tooltip>
            }
          </Grid>
          
          <Grid item xs={2} sx={{ justifyContent: "center" }}>
            {(!currentProduct.limit && isLoggedIn && isOperator(auth.user)) &&
              <Tooltip title={t("Edit product")}>
                <IconButton
                  size="small"
                  onClick={() => editProduct()}
                  sx={{
                    borderRadius: 1,
                    px: { xs: 1, sm: 2, },
                    py: 1,
                    margin: 1,
                    backgroundColor: "primary.main", // or a custom color
                    "&:hover": {
                      backgroundColor: "primary.dark", // slightly darker on hover
                    },
                  }}
                >
                  <Edit fontSize="small" />
                  {!isMobile && <Typography component={"span"} variant={"caption"} sx={{ pl: 1, fontSize: "1rem", fontWeight: "bold"}}> {t("Edit")} </Typography>}
                </IconButton>
              </Tooltip>
            }
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

          <Grid item xs={2+2}></Grid>{/* to balance buttons on the left */}
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

  const handleUserJoin = (event) => {
    navigate("/signin", { replace: true });
  };

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
      {product.limit && !isLoggedIn && (
        <Typography sx={{py: 10, px: 2, margin: 1}}>
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
      {product.limit && isLoggedIn && !isDealer(auth.user) && (
        <Typography sx={{py: 10, px: 2, margin: 1}}>
          {t("To access all products, please ask for \"dealer\" role here:")}{" "}
          <PhoneNumber phoneNumber={config.company.contacts.dealerRoleRequestPhoneNumber} />
        </Typography>
      )}
      {/* top section: product image */}
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
