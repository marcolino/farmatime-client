import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import config from "../config";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { t } = useTranslation();
  item.price = item.price ?? 123; // TODO...
  const [quantity, setQuantity] = useState(item.quantity ?? 1);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
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

  const totalPrice = item.price * quantity;

  return (
    <>
      <Box
        sx={{
          maxWidth: 400, // Limit component width
          padding: 2,
        }}
      >
        <Grid container spacing={2}>
          {/* First Column: Image */}
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            rowSpan={4} // Occupy all 4 rows
          >
            <Box
              component="img"
              src={`${config.siteUrl}${config.images.publicPath}/${item.imageName}`}
              alt={item.mdaCode}
              sx={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          </Grid>

          {/* Second Column: Title and Attributes */}
          <Grid item xs={7}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ lineHeight: 1.5 }}
            >
              {t("MDA code")} {item.mdaCode}
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              {t("OEM code")} {item.oemCode}
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              {t("Make")} {item.make}
            </Typography>
          </Grid>

          {/* Quantity Row */}
          <Grid item xs={7}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">{t("Quantity")}</Typography>
              <Box display="flex" alignItems="center">
                <IconButton
                  size="small"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 32,
                    textAlign: "center",
                    fontSize: "1rem", // Consistent font size
                  }}
                >
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleIncrease}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Third Column: Close Icon and Price */}
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <IconButton
              aria-label="Remove item"
              size="medium"
              onClick={handleRemove}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                fontSize: "1rem",
              }}
            >
              €{totalPrice.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </>
  );
};

export default React.memo(CartItem);
