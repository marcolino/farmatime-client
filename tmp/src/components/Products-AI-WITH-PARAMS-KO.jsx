import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Paper, Typography, Box, Grid, FormControlLabel, RadioGroup, Radio, useMediaQuery } from "@mui/material";
import { Search } from "@mui/icons-material";
import debounce from "lodash.debounce";
import { AuthContext } from "../providers/AuthProvider";
import { apiCall } from "../libs/Network";
import { TextFieldSearch, Button } from "./custom";
import ProductsDetails from "./ProductsDetails";
import { useSnackbarContext } from "../providers/SnackbarProvider";
import config from "../config";


function Products() {
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarContext(); 
  const theme = useTheme();
  const bottomRef = useRef(null);
  const debounceSearchMilliseconds = 2 * 1000;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { productId } = useParams(); // extract productId from route params
  const filtersDefault = {
    _id: "",
    mdaCode: "",
    oemCode: "",
    make: "",
    models: "",
    type: "",
  };

  if (config.customization === "mda") {
    const [filters, setFilters] = useState(filtersDefault);
    const [products, setProducts] = useState([]);
    const [productsTotalCount, setProductsTotalCount] = useState(-1);
    const [isSearching, setIsSearching] = useState(false);
    const [isDebouncing, setIsDebouncing] = useState(false);

    const fetchProducts = async (filters) => {
      console.log("DBG> fetchProducts");
      try {
        setIsSearching(true);
        const filter = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v));
        const result = await apiCall("get", "/product/getProducts", { filter });
        if (result.err) {
          showSnackbar(result.message, result.status === 401 ? "warning" : "error");
        } else {
          setProducts(result.products);
          setProductsTotalCount(result.count);
        }
      } catch (error) {
        showSnackbar(error.message, "error");
        console.error("Error getting products:", error);
      } finally {
        setIsSearching(false);
      }
    };

    // Existing debounce logic
    const debouncedFetchProducts = debounce((filters) => {
      if (hasFilters()) {
        if (isDebouncing) {
          fetchProducts(filters);
        }
      } else {
        setProducts([]);
      }
      setIsDebouncing(false);
    }, debounceSearchMilliseconds);

    const hasFilters = () => Object.values(filters).some(value => value !== "");

    // effect to be run when productId changes
    useEffect(() => {
      if (productId) {
        console.log("DBG> productId detected:", productId, "++++++++++++++++++");
        const filtersInitial = { ...filtersDefault, _id: productId };
        setFilters(filtersInitial);
        fetchProducts(filtersInitial);
      }
    }, [productId]);

    // effect to call the debounced fetch function when filters change, on desktop only
    useEffect(() => {
      console.log("DBG> useEffect, isMobile:", isMobile, ", productId:", productId, ", hasFilters:", hasFilters(), "----------------");
      if (!isMobile && !productId) {
        if (hasFilters()) {
          setIsDebouncing(true);
          debouncedFetchProducts(filters);
          return () => debouncedFetchProducts.cancel();
        }
      }
    }, [filters, isMobile, productId]);

    useEffect(() => {
      if (isMobile) { // on mobile scroll down to put product into view (on desktop product is on another column, so it is always in to view)
        if (products.length > 0) {
          // delay scrolling to allow animations to complete
          const timeoutId = setTimeout(() => {
            bottomRef.current?.focus();
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 300); // adjust this duration based on animation/render timing    
          return () => clearTimeout(timeoutId);
        }
      }
    }, [products]);

    // effect to cancel debouncing when isDebouncing turns to false
    // useEffect(() => {
    //   if (!isDebouncing) {
    //     debouncedFetchProducts.cancel();
    //   }
    // }, [isDebouncing]);
    
    // handle input filters changes
    const handleFiltersChange = (e) => {
      console.log("DBG> handleFiltersChange");
      const { name, value } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    };

    // handle search
    const handleSearch = () => {
      console.log("DBG> handleSearch");
      setIsDebouncing(false);
      fetchProducts(filters);
    };

    // handle reset filters and product list
    const handleResetFilters = () => {
      console.log("DBG> handleResetFilters");
      setFilters(filtersDefault);
      setIsDebouncing(false);
      setProducts([]);
    };

    console.log("DBG> ---------------------------------");
    console.log("DBG> products:", products);
    console.log("DBG> !isSearching:", !isSearching);
    console.log("DBG> !isDebouncing:", !isDebouncing);
    console.log("DBG> hasFilters():", hasFilters()); 
    console.log("DBG> filters:", filters);
    console.log("DBG> show products?:", (!isSearching && hasFilters() && !isDebouncing));
    console.log("DBG> ---------------------------------");

    return (
      <Grid container spacing={0}>
        {/* for xs breakpoint, full width */}
        <Grid item xs={12} sm={4} md={3} lg={2}
         sx={{ 
          minWidth: { sm: "280px" },
          flexGrow: { sm: 1 },
          flexBasis: { sm: "auto" }
        }}>
          <Box sx={{ height: "100%", padding: 2 }}>
            <h2>{t("Products")}</h2>
            <TextFieldSearch
              name="mdaCode"
              label={t("MDA code")}
              value={filters.mdaCode}
              onChange={handleFiltersChange}
              startIcon={<Search />}
              fullWidth={false}
              sx={{
                color: theme.palette.text.primary
              }}
            />
            <TextFieldSearch
              name="oemCode"
              label={t("OEM code")}
              value={filters.oemCode}
              onChange={handleFiltersChange}
              startIcon={<Search />}
              fullWidth={false}
              sx={{
                color: theme.palette.text.primary
              }}
            />
            <TextFieldSearch
              name="make"
              label={t("Make")}
              value={filters.make}
              onChange={handleFiltersChange}
              startIcon={<Search />}
              fullWidth={false}
              sx={{
                color: theme.palette.text.primary
              }}
            />
            <TextFieldSearch
              name="models"
              label={t("Models")}
              value={filters.models}
              onChange={handleFiltersChange}
              startIcon={<Search />}
              fullWidth={false}
              sx={{
                color: theme.palette.text.primary
              }}
            />

            <RadioGroup
              name="type"
              value={filters.type}
              onChange={handleFiltersChange}
              sx={{
                "& .MuiFormControlLabel-root": {
                  marginBottom: -1.5, // reduce space between FormControlLabel elements
                },
              }}
              aria-label="options"
            >
              {/* TODO: get type values from `getProductTypes` server call */}
              <FormControlLabel value="" control={<Radio size={"small"} />}
                label={<Typography variant="body2" color="textSecondary" sx={{whiteSpace:"nowrap"}}>{t("All")}</Typography>}
              />
              <FormControlLabel value="motorino" control={<Radio size={"small"} />}
                label={<Typography variant="body2" color="textSecondary" sx={{whiteSpace:"nowrap"}}>motorino</Typography>}
              />
              <FormControlLabel value="alternatore" control={<Radio size={"small"} />}
                label={<Typography variant="body2" color="textSecondary" sx={{whiteSpace:"nowrap"}}>alternatore</Typography>}
              />
            </RadioGroup>

            <Grid item xs={12} sm sx={{ flexGrow: 999, mt: 3 }}>
              <Button color="primary" fullWidth={false} size={"large"} sx={{ mr: 1 }}
                onClick={handleSearch}>
                {t("Search")}
              </Button>
              <Button color="secondary" fullWidth={false} size={"small"} sx={{ mr: 1 }}
                onClick={handleResetFilters}>
                {t("Clear all")}
              </Button>
            </Grid>

            {
              (!isSearching && hasFilters() && !isDebouncing) && (
                <Typography sx={{
                  mt: 3,
                  fontSize: ["0.95rem", "!important"],
                }}>
                  {
                    (productsTotalCount < 0) ?
                      t("not searched yet...")
                    :
                    (productsTotalCount === 0) ?
                      t("No products found")
                    :
                      t("{{count}} products found", { count: productsTotalCount })
                  }
                </Typography>
              )
            }

          </Box>

        </Grid>

        {/* for sm and up breakpoints, takes remaining space */}
        <Grid item xs={12} sm
          sx={{
            display: "flex",
            flexDirection: "column",
            py: 0,
            my: 0,
          }}
        >
          <Box sx={{ height: "100%", py: 0, my: 0 }}>
           {
              isSearching ? (
                <>searching...</>
              ) :
              !hasFilters() ? (
                <>no filters...</>
              ) :
              isDebouncing ? (
                <>debouncing...</>
              ) :
              (productsTotalCount < 0) ? (
                t("not searched yet...")
              ) :
              (productsTotalCount === 0) ? (
                t("No products found")
              ) :
                <ProductsDetails products={products} productsTotalCount={productsTotalCount}  />
            }
          </Box>
          <span ref={bottomRef} _sx={{ display: "none" }} />
        </Grid>
      </Grid>
    );
  }
  
  return (
    <Paper sx={{px: 1}}>
      <Typography>
        {`${t("Products")} ${t("for")} ${auth.user ? t("authenticated user") : t("guest user")} ${auth.user ? auth.user.email : ""}`}
      </Typography>
    </Paper>
  );
}

export default React.memo(Products);

