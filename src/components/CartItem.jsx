import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { 
  Box, 
  Grid, 
  Typography, 
  IconButton, 
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useMediaQueryContext } from "../providers/MediaQueryProvider";
import { currencyFormat } from "../libs/Misc";
import config from "../config";


const CartItem = ({ item, quantity, onQuantityChange, onRemove }) => {
  const { t } = useTranslation();
  const [quantityCurrent, setQuantityCurrent] = useState(quantity ?? 1);
  const [priceCurrent, setPriceCurrent] = useState(item.price * quantityCurrent);
  const { md } = useMediaQueryContext();

  const handleIncrease = () => {
    const newQuantity = quantityCurrent + 1;
    setQuantityCurrent(newQuantity);
    setPriceCurrent(item.price * newQuantity);
    if (onQuantityChange) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantityCurrent > 1) {
      const newQuantity = quantityCurrent - 1;
      setQuantityCurrent(newQuantity);
      setPriceCurrent(item.price * newQuantity);
      if (onQuantityChange) {
        onQuantityChange(item.id, newQuantity);
      }
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    }
  };

  return (
    <Box sx={{ margin: "0 auto", mb: 0.5 }}>
      <Grid container spacing={1.5}>
        {/* 1st column - image */}
        <Grid item xs={3} sx={{ gridRow: "span 2", height: "100%" }}>
          <Box component="img"
            src={`${config.siteUrl}${config.images.publicPath}/${item.imageName}`}
            alt="Product"
            sx={{
              width: "100%",
              objectFit: "cover",
              borderRadius: 1,
              mt: 1,
            }}
          />
        </Grid>

        {/* 2nd column - text content */}
        <Grid item xs={7}>
          <Box sx={{ height: "100%", lineHeight: 2}}>
            <Typography variant={ md ? "body2" : "body1" } lineHeight={1.5} fontWeight="bold">
              <Box component="span" sx={{ color: "text.secondary" }}>
                {item.title}
              </Box>
            </Typography>

            <Typography
              variant={ md ? "subtitle1" : "body2" }
              sx={{
                //typography: md ? "subtitle1" : "body2",
                lineHeight: 1.5,
                display: "flex", // Use flex for layout control
                alignItems: "center", // Align items on the same line
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "text.secondary",
                  opacity: 0.5,
                }}
              >
                {t("Description")}:
              </Box>
              <Tooltip title={item.description}>
                <Box
                  component="span"
                  sx={{
                    color: "text.secondary",
                    marginLeft: 1,
                    //whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.description}
                </Box>
              </Tooltip>
            </Typography>

            <Typography variant={ md ? "subtitle1" : "body2" } lineHeight={1.5}>
              <Box component="span" sx={{ color: "text.secondary", opacity: 0.5 }}>
                {item.attribute1key}:
              </Box>
              <Box component="span" sx={{ color: "text.secondary", marginLeft: 1 }}>
                {item.attribute1value}
                </Box>
            </Typography>
            <Typography variant={ md ? "subtitle1" : "body2" } lineHeight={1.5}>
              <Box component="span" sx={{ color: "text.secondary", opacity: 0.5 }}>
                {item.attribute2key}:
              </Box>
              <Box component="span" sx={{ color: "text.secondary", marginLeft: 1 }}>
                {item.attribute2value}
              </Box>
            </Typography>

            
            {/* quantity */}
            <Box sx={{ margin: 0, padding: 0, mb: md ? -1.2 : -1 }}></Box> {/* reduce vertical distance with lines above */}
            <Typography
              variant={ md ? "subtitle1" : "body2" }
              lineHeight={1.5}
              sx={{
                color: "text.secondary",
                display: "inline-flex",
                alignItems: "center",
                gap: 2, // space between left text and quantity control
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "text.secondary",
                  opacity: 0.5,
                  whiteSpace: "nowrap",
                }}
              >
                {t("Quantity")}:
              </Box>

              {/* quantity control */}
              <Box
                component="span"
                sx={{
                  color: "text.secondary",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleDecrease}
                  disabled={quantityCurrent <= 1}
                  fontSize="inherit"
                  sx={{
                    //opacity: quantity > 1 ? 1 : 0.2,
                    fontSize: 12,
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    padding: 0,
                  }}
                >
                  <RemoveIcon sx={{fontSize: 16}} />
                </IconButton>

                <Box
                  component="span"
                  sx={{
                    minWidth: 24,
                    textAlign: "center",
                    fontSize: "1rem",
                  }}
                >
                  {quantityCurrent}
                </Box>

                <IconButton
                  size="small"
                  onClick={handleIncrease}
                  sx={{
                    opacity: 1,
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    padding: 0,
                  }}
                >
                  <AddIcon sx={{fontSize: 16}}/>
                </IconButton>
              </Box>
            </Typography>

          </Box>
        </Grid>

        {/* 3rd column - close icon and price */}
        <Grid item xs={2}>
          <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%"/*, backgroundColor: "yellow"*/}}>
            <Box sx={{ textAlign: "right" }}>
              <IconButton
                size="small"
                onClick={handleRemove}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography
              variant={ md ? "subtitle1" : "body1" }
              lineHeight={1.5}
              sx={{
                mb: 0.6,
                //pr: 5,
                //ml: -3, // we could use negative values here to shift price to the left, to avoid horizontal scrolls of CartItem, if proces are higher than 999.99
                color: "text.secondary",
                textAlign: "right",
                whiteSpace: "nowrap",
                //backgroundColor: "yellow"
              }}
            >
              {currencyFormat(priceCurrent, item.currency)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

CartItem.propTypes = {
  item: PropTypes.object,
  quantity: PropTypes.number,
  onQuantityChange: PropTypes.function,
  onRemove: PropTypes.function,
};

export default React.memo(CartItem);
