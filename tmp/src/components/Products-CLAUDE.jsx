import React, { useState, useEffect, useCallback, useContext } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Paper, Typography, Box, Grid, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Search } from "@mui/icons-material";
import { AuthContext } from "../providers/AuthProvider";
import { apiCall } from "../libs/Network";
import { debounce } from "../libs/Misc";
import { TextFieldSearch, Button } from "./custom";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import config from "../config";

const debounced = () => debounce(func => {
  return func();
}, 800);

function Products() {
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarContext(); 
  const theme = useTheme();
  //console.log("CUSTOM:", config.customization);

  if (config.customization === "mda") {
    const [products, setProducts] = useState([]);
    const [filterMda, setFilterMda] = useState("");
    const [filterOem, setFilterOem] = useState("");
    const [filterMake, setFilterMake] = useState("");
    const [filterModel, setFilterModel] = useState("");
    const [filterType, setFilterType] = useState("");
    const [search, setSearch] = useState(false);

    // // memoize the debounced function
    // const debounced = useCallback(
    //   debounce(async (func) => {
    //     await func();
    //   }, 1800),
    //   [] // empty dependency array to ensure it is only created once
    // );

    const debouncedSearch = debounce(async (filterMda, filterOem, filterMake, filterModel, filterType, setProducts, setSearch, showSnackbar) => {
      const filter = {};
      if (filterMda.length) filter.mdaCode = filterMda;
      if (filterOem.length) filter.oemCode = filterOem;
      if (filterMake.length) filter.make = filterMake;
      if (filterModel.length) filter.model = filterModel;
      if (filterType.length) filter.type = filterType;
    
      const result = await apiCall("get", "/product/getProducts", { filter });
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        setProducts(result.products);
      }
      setSearch(false);
    }, 3000);

    useEffect(() => {
      if (search) {
        // actually execute the debounced function
        debouncedSearch(filterMda, filterOem, filterMake, filterModel, filterType, setProducts, setSearch, showSnackbar);
      }
    
      return () => {
        console.log("ProductTable unmounted");
      };
    }, [search, filterMda, filterOem, filterMake, filterModel, filterType]);

    // useEffect(() => { // get all product types on mount
    //   (async () => {
    //     const result = await apiCall("get", "/product/getProductAllConstraintsById", { });
    //     if (result.err) {
    //       showSnackbar(result.message, result.status === 401 ? "warning" : "error");
    //     } else {
    //       setTypes(result.types);
    //     }
    //   })();
    // }, []);


    const handleSearch = () => {
      setSearch(true); // trigger the useEffect search
    };

    const handleFilterMdaChange = (event) => {
      setFilterMda(event.target.value);
      setSearch(true);
    };

    const handleFilterOemChange = (event) => {
      setFilterOem(event.target.value);
      setSearch(true);
    };

    const handleFilterMakeChange = (event) => {
      setFilterMake(event.target.value);
      setSearch(true);
    };

    const handleFilterModelChange = (event) => {
      setFilterModel(event.target.value);
      setSearch(true);
    };

    const handleFilterTypeChange = (event) => {
      setFilterType(event.target.value);
      setSearch(true);
    };

    const clearAllFilters = (event) => {
      setFilterMda("");
      setFilterOem("");
      setFilterMake("");
      setFilterModel("");
      setFilterType("");
      setSearch(true);
    }

    return (
      <Grid container spacing={2}>
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
              label={t("MDA code")}
              value={filterMda}
              onChange={handleFilterMdaChange}
              startIcon={<Search />}
              fullWidth={false}
              sx={{
                color: theme.palette.text.primary
              }}
            />
            <TextFieldSearch
              label={t("OEM code")}
              value={filterOem}
              onChange={handleFilterOemChange}
              startIcon={<Search />}
              fullWidth={false}
              sx={{
                color: theme.palette.text.primary
              }}
            />
            <TextFieldSearch
              label={t("mother house")}
              value={filterMake}
              onChange={handleFilterMakeChange}
              startIcon={<Search />}
              fullWidth={false}
              sx={{
                color: theme.palette.text.primary
              }}
            />
            <TextFieldSearch
              label={t("model")}
              value={filterModel}
              onChange={handleFilterModelChange}
              startIcon={<Search />}
              fullWidth={false}
              sx={{
                color: theme.palette.text.primary
              }}
            />

            <RadioGroup aria-label="options" name="options"
              value={filterType}
              onChange={handleFilterTypeChange}
              sx={{
                "& .MuiFormControlLabel-root": {
                  marginBottom: -1.5, // reduce space between FormControlLabel elements
                },
              }}
            >
              {/* TODO: get type values from server call */}
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
                onClick={clearAllFilters}>
                {t("Clear all")}
              </Button>
            </Grid>

          </Box>

        </Grid>

        {/* for sm and up breakpoints, takes remaining space */}
        <Grid item xs={12} sm sx={{ flexGrow: 999 }}>
          <Box style={{ height: "100%", _backgroundColor: "#eeeeee", padding: 2 }}>
            <>
            <div>search: {search ? "true" : "false"}</div>
            {(products.length > 0)|| "No products"}
            {products.map((product, index) => (
              <div key={index}>
                <p><img src={`${config.siteUrl}${config.images.publicPathWaterMark}/${product.imageName}`}
                  alt="Product image"
                  style={{ maxWidth: 240 }}
                /></p>
                <span>id: {product._id}</span> | 
                <span>models: {product.models}</span> | 
                <span>mdaCode: {product.mdaCode}</span> | 
                <span>oemCode: {product.oemCode}</span> | 
                <span>make: {product.make}</span> | 
                <span>application: {product.application}</span> | 
                <span>kw: {product.kw}</span> | 
                <span>volt: {product.volt}</span> | 
                <span>ampere: {product.ampere}</span> | 
                <span>teeth: {product.teeth}</span> | 
                <span>rotation: {product.rotation}</span> | 
                <span>regulator: {product.regulator}</span> | 
                <span>notes: {product.notes}</span> | 
                <span>type: {product.type}</span> | 
                <hr />
              </div>
            ))}
            </>
          </Box>
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