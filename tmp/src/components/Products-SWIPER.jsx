import React, { useState, useEffect, useContext, useRef } from "react";
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
  const debounceSearchMilliseconds = 400;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (config.customization === "mda") {
    const [filters, setFilters] = useState({
      mdaCode: "",
      oemCode: "",
      make: "",
      model: "",
      type: "",
    });
    const [products, setProducts] = useState([]);
    const [productsTotalCount, setProductsTotalCount] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [isDebouncing, setIsDebouncing] = useState(false);

    // fetch products from the API
    const fetchProducts = async (filters) => {
      try {
        setIsSearching(true);
        // filter all props not empty props in filters
        const filter = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v));
        // trim all filters values
        Object.keys(filter).forEach(k => filter[k] = filter[k].trim());
        // get all products for these filters
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

    const hasFilters = Object.values(filters).some(value => value !== "");

    // debounced products fetch
    const debouncedFetchProducts = debounce((filters) => {
      if (hasFilters) {
        fetchProducts(filters);
      } else {
        setProducts([]); // reset products list when filters are empty
      }
      setIsDebouncing(false);
    }, debounceSearchMilliseconds);

    // effect to call the debounced fetch function when filters change
    useEffect(() => {
      setIsDebouncing(true);
      debouncedFetchProducts(filters);
      return () => { // cleanup function to cancel debounce on unmount
        debouncedFetchProducts.cancel();
      };
    }, [filters]);

    // handle input filters changes
    const handleFiltersChange = (e) => {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    };

    // handle search
    const handleSearch = () => {
      fetchProducts(filters);
    };

    // handle reset filters and product list
    const handleResetFilters = () => {
      setFilters({
        mdaCode: "",
        oemCode: "",
        make: "",
        model: "",
        type: "",
      });
      setProducts([]);
    };

    // scroll to bottom when products are loaded
    // useEffect(() => {
    //   if (products.length) {
    //     console.log("scrolling to bottom smoothly");
    //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    //     //window.scrollTo({ bottom: -300, behavior: "smooth" });
    //   }
    // }, [products]);
    useEffect(() => {
      if (isMobile) { // on mobile scroll down to put product into view
        if (products.length > 0) {
          // delay scrolling to allow animations to complete
          const timeoutId = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100); // adjust this duration based on animation/render timing    
          return () => clearTimeout(timeoutId);
        }
      }
    }, [products]);

    return (
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, // Stacks on xs, aligns horizontally on sm and above
          alignItems: "stretch", // Ensures both children align correctly
        }}
      >
        {/* Filters Section */}
        <Grid 
          item 
          xs={12} 
          sm={4} 
          md={3} 
          lg={2} 
          sx={{ 
            flexShrink: 0, // Prevents filters from shrinking
            minWidth: "280px", // Ensures a consistent width
          }}
        >
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
              name="model"
              label={t("Model")}
              value={filters.model}
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
              (!isSearching && hasFilters && !isDebouncing) && (
                <Typography sx={{
                  mt: 3,
                  fontSize: ["0.95rem", "!important"],
                }}>
                  {productsTotalCount ?
                    t("{{count}} products found", { count: productsTotalCount })
                  :
                    t("No products found")
                  }
                </Typography>
              )
            }

          </Box>

        </Grid>

        {/* for sm and up breakpoints, takes remaining space */}
        <Grid 
          item 
          xs={12} 
          sm 
          sx={{ 
            flexGrow: 1, 
            display: "flex",
          }}
        >
          <Box sx={{ width: "100%", height: "100%", padding: 2 }}>
           {
              isSearching ? (
                <p>{t("Loading...")}</p>
              ) :
              !hasFilters ? (
                <p></p>
              ) :
              !isDebouncing && products.length === 0 ? (
                    <p>{/*t("No products found")*/}</p>
              ) :
              <ProductsDetails products={products} productsTotalCount={productsTotalCount}  />
            }
          </Box>
        </Grid>
        <Box ref={bottomRef} />
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