import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  Checkbox,
  Link,
  Divider,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { ShoppingCart, Reorder } from "@mui/icons-material";
import CartItem from "./CartItem";
import { apiCall } from "../libs/Network";
import { AuthContext } from "../providers/AuthContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";
import { useCart } from "../providers/CartProvider";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useDialog } from "../providers/DialogContext";
//import LocalStorage from "../libs/LocalStorage";
import { currencyFormat } from "../libs/Misc";
import config from "../config";


const Cart = (props) => {
  const { auth, isLoggedIn, updateSignedInUserPreferences } = useContext(AuthContext);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const { cart, /*saveCart, */emptyCartItems, setCartProperty, removeItemFromCart, cartItemsQuantity, setItemQuantity } = useCart();
  const [errors, setErrors] = useState(false);
  const [acceptToReceiveOffersEmails, setAcceptToReceiveOffersEmails] = useState(cart?.acceptToReceiveOffersEmails ?? false);
  const [delivery, setDelivery] = useState(config.ecommerce.delivery.methods.find(method => method.code === cart?.deliveryCode) ?? { code: "-" });
  const [pricePartialTotal, setPricePartialTotal] = useState(0);
  const { md } = useMediaQueryContext();
  const navigate = useNavigate();
  const currency = config.currencies[config.currency];

  const handleChangeDelivery = (event) => {
    setDelivery(config.ecommerce.delivery.methods.find(method => method.code === event.target.value));
    setCartProperty("deliveryCode", event.target.value);
    setErrors({ ...errors, delivery: false });
  };

  // handle `is a gift` flag toggle
  const toggleGift = (event) => {
    //setIsGift(prev => !prev);
    setCartProperty("isGift", event.target.value === "on");
  };

  // handle `accept to receive offers emails` flag
  const handleAcceptToReceiveOffersEmails = (event) => {
    setAcceptToReceiveOffersEmails(event.target.checked);
    setCartProperty("acceptToReceiveOffersEmails", event.target.checked);
  };

  // calculate price partial total and serialize cart
  useEffect(() => {
    const total = cart?.items?.reduce((a, b) => {
      return a + (b.price * (b.quantity || 1));
    }, 0);
    setPricePartialTotal(total);
    //saveCart(cart);
    //LocalStorage.set("cart", cart);
  }, [cart]); //, updatePricePartialTotal]);

  // // serialize cart to localstorage
  // useEffect(() => {
  //   LocalStorage.set("cart", cart);

  // }, [cart]);

  // handle checkout
  const handleCheckout = async () => {
    // validate form fields
    if (delivery.code === "-") { // no delivery method selected
      setErrors({ ...errors, delivery: true });
      showSnackbar(t("Please choose a delivery method"), "warning");
      return;
    }

    const result = await apiCall("post", "/payment/createCheckoutSession", { cart });
    if (result.err) {
      showSnackbar(result.message, "error");
      console.error("createCheckoutSession error:", result);
    } else {
      if (result.user) { // the user is an authenticatd one
        if (auth.user?.id === result.user._id) { // the user is the logged one
          // update user preferences field in auth
          const updatedUser = auth.user;
          updatedUser.preferences = result.user?.preferences;
          updateSignedInUserPreferences(updatedUser);
        }
      }
      const { url } = result.session;
      window.location.href = url; // redirect to Stripe Checkout in the same window (use `window.open(url, "_blank")` to redirect to Stripe Checkout in a new window)
    }
  };

  // handle payment response
  useEffect(() => {
    switch (props.payment) {
      case "success": // coming from checkout session: purchase completed successfully
        showDialog({
          title: t("Purchase completed successfully"),
          message: "🎉" + " " + t("Compliments, {{count}} products have been purchased", { count: cartItemsQuantity() }) + "!",
          confirmText: t("Go back to products"),
          onConfirm: () => {
            emptyCartItems();
            navigate("/products");
          },
        });
        break;
      case "cancel": // coming from checkout session: purchase was canceled
        showDialog({
          title: "😢" + " " + t("Purchase has been canceled"),
          message: t("The purchase was not finalized") + ".\n" + t("You can retry, or update your cart") + ".",
          confirmText: t("Ok"),
        });
        break;
      default: // coming from internal routing
        break;
    }
  }, [props.payment/*, cartItemsQuantity, emptyCartItems, navigate, showDialog, t*/]);

  if (!config.ecommerce.enabled) return;

  if (cart.items?.length <= 0) {
    return (
      <Container>
        <Card sx={{ marginTop: 2, padding: { sx: 2, sm: 3, md: 4 } }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                //fontWeight: "bold",
                gap: 1, // add spacing between icon and text
              }}
            >
              <ShoppingCart />
              {t("Cart is empty")}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
              <Button variant="contained" color="primary" onClick={() => navigate("/products")}>
                {t("Go to Products")}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card sx={{ marginTop: 2, padding: { sx: 2, sm: 3, md: 4 } }}>
        <CardContent>
          <Grid container columnSpacing={8} rowSpacing={1} sx={{ flexGrow: 1 }}>
            {/* first panel */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  //fontWeight: "bold",
                  gap: 1, // add spacing between icon and text
                }}
              >
                <ShoppingCart />
                {t("Cart summary")}
              </Typography>
              <Box
                sx={{
                  maxHeight: "33vh",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  padding: 1,
                }}
              >
                {cart?.items?.map((cartItem, index) => (
                  <div key={index}>
                    <CartItem
                      item={{ // cartItem info depends on the specific customization product; CartItem component is generic
                        id: cartItem._id,
                        title: cartItem.mdaCode,
                        description: cartItem.notes,
                        price: cartItem.price,
                        currency,
                        imageName: cartItem.imageName,
                        attribute1key: t("OEM code"), attribute1value: cartItem.oemCode,
                        attribute2key: t("Make"), attribute2value: cartItem.make,
                      }}
                      quantity={cartItem.quantity ?? 1}
                      onQuantityChange={setItemQuantity}
                      onRemove={removeItemFromCart}
                    />
                    {index < (cart?.items?.length - 1) && <Divider />} {/* add a divider if the item is not the last one */}
                  </div>
                ))}
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ ml: 2 }}>
                <Typography variant="body2">
                  {t("Partial total") + " (" + t("{{count}} articles", { count: cartItemsQuantity() }) + ")"}
                </Typography>
                <Typography variant="body1" sx={{mr: 5, fontWeight: "bold"}}>
                  {currencyFormat(pricePartialTotal, currency)}
                </Typography>
              </Box>
              <Box sx={{ mt: -2, ml: 2 }}>
                <Typography variant="subtitle1">{t("Duties and taxes included")}</Typography>
              </Box>
              
              {config.ecommerce.delivery.enabled && // ecommerce delivery is enabled
                <FormControl sx={{ mt: 3, minWidth: 120 }} error={errors.delivery}>
                  <InputLabel id="delivery-label">{t("Delivery method")}</InputLabel>
                  <Select
                    labelId="delivery-label"
                    id="delivery"
                    value={delivery.code || "-"}
                    label={t("Delivery method")}
                    onChange={handleChangeDelivery}
                  //renderValue={(value) => `⚠️  - ${value}`}
                  >
                    <MenuItem value={"-"} disabled>
                      {/* <em>{t("Choose a delivery method")}</em> */}
                    </MenuItem>
                    {config.ecommerce.delivery.methods.map((deliveryMethod, index) =>
                      <MenuItem key={index} value={deliveryMethod.code}>
                        {t(deliveryMethod.description)}
                      </MenuItem>
                    )}
                  </Select>
                  <FormHelperText>{errors.delivery ? t("Please choose a delivery method") : ""}</FormHelperText>
                </FormControl>
              }

              {config.ecommerce.gift &&
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox onClick={toggleGift} />
                    <Typography variant={md ? "subtitle1" : "body2"}>{t("Is it a gift?")}</Typography>
                  </Box>
                  <Box sx={{ mt: -1, ml: 6 }}>
                    <Typography variant="subtitle1">{t("In this case we will not put the invoice inside the parcel")}</Typography>
                  </Box>
                </Box>
              }
            </Grid>

            {/* second panel */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  //fontWeight: "bold",
                  gap: 1, // add spacing between icon and text
                }}
              >
                <Reorder />
                {t("Order summary")}
              </Typography>
              <Box
                sx={{
                  maxHeight: "33vh",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  padding: 1,
                }}
              >
                {cart?.items?.map((item, index) => (  
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ pl: 2 }}>
                    <Typography variant="body2">
                      {item.mdaCode}
                    </Typography>
                    <Typography variant="body2">
                      {currencyFormat(item.price, config.currency)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box lineHeight={1.5}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ pl: 2 }}>
                  <Typography variant="body2">
                    {t("Partial total")}
                  </Typography>
                  <Typography variant="body1" sx={{mr: 1, fontWeight: "bold"}}>
                    {currencyFormat(pricePartialTotal, currency)}
                  </Typography>
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1">{t("Duties and taxes included")}</Typography>
                </Box>

                {delivery.code !== "-" &&
                  <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ pl: 2 }}>
                      <Typography variant="body2">
                        {t("Delivery costs")}
                      </Typography>
                      <Typography variant="body1" sx={{mr: 1, fontWeight: "bold"}}>
                        {/* {currencyFormat(config.ecommerce.delivery.methods[delivery]?.price, currency)} */}
                        {currencyFormat(delivery.price, currency)}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1">{delivery.description}</Typography>
                    </Box>
                  </>
                }

                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ mt: 3, pl: 2, py: 1.5, bgColor: "ochre.dark" }}>
                  <Typography variant="body1">
                    {t("ORDER TOTAL")}
                  </Typography>
                  <Typography variant="body1" sx={{ mr: 1, fontWeight: "bold"}}>
                    {currencyFormat(pricePartialTotal + (delivery.code !== "-" ? delivery.price : 0), currency)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox checked={acceptToReceiveOffersEmails} onChange={handleAcceptToReceiveOffersEmails} />
                <Typography variant={md ? "subtitle1" : "body2"}>{t("Send me e-mail on new products, offers and surprises!")}</Typography>
              </Box>
              <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ width: "fit-content", mx: "auto" }}>
                {t("Checkout")} {/*} + " " + t("with") + " " + config.ecommerce.checkoutProvider} */}
                {/* <Box component="img" sx={{ height: 24, ml: 1 }} alt={t("Stripe Checkout logo")} src="src/assets/images/StripeFacts.png" /> */}
              </Button>

              {/* this disclaimer is to be used if user is not logged in (and if we accept orders fron not logged in users...) */}
              {!isLoggedIn &&
                <Grid container justifyContent="flex-start" sx={{ mt: 0 }}>
                  <Typography component="h6" variant="subtitle1" color="textSecondary" _align="center">
                    {t("By placing an order")} {t("you agree to our")} <Link href="/terms-of-use" color="textPrimary">{t("terms of use")}</Link> {" "}
                    {t("and you confirm you have read our")} <Link href="/privacy-policy" color="textPrimary">{t("privacy policy")}</Link>
                    {"."}
                  </Typography>
                </Grid>
              }

            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

Cart.propTypes = {
  payment: PropTypes.string,
};

export default React.memo(Cart);
