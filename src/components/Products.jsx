import React, { useState, useContext } from "react";
import { useTheme } from "@mui/material/styles";
import { Paper, Typography, Box, Grid, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { AuthContext } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { TextFieldSearch, Button } from "./custom";
import { Search } from "@mui/icons-material";
import config from "../config";

function Products() {
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  const theme = useTheme();
  //console.log("CUSTOM:", config.customization);

  if (config.customization === "mda") {
    const [filterMda, setFilterMda] = useState("");
    const [filterOem, setFilterOem] = useState("");
    const [filterMotherHouse, setFilterMotherHouse] = useState("");
    const [filterModel, setFilterModel] = useState("");
    const [filterType, setFilterType] = useState("*");

    const handleFilterMdaChange = (event) => {
      setFilterMda(event.target.value);
    };

    const handleFilterOemChange = (event) => {
      setFilterOem(event.target.value);
    };

    const handleFilterMotherHouseChange = (event) => {
      setFilterMotherHouse(event.target.value);
    };

    const handleFilterModelChange = (event) => {
      setFilterModel(event.target.value);
    };

    const handleFilterTypeChange = (event) => {
      setFilterType(event.target.value);
    };

    const clearAllFilters = (event) => {
      setFilterMda("");
      setFilterOem("");
      setFilterMotherHouse("");
      setFilterModel("");
      setFilterType("*");
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
              value={filterMotherHouse}
              onChange={handleFilterMotherHouseChange}
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
              <FormControlLabel value="*" control={<Radio size={"small"} />}
                label={<Typography variant="body2" color="textSecondary" sx={{whiteSpace:"nowrap"}}>{t("All")}</Typography>}
              />
              <FormControlLabel value="self-starter" control={<Radio size={"small"} />}
                label={<Typography variant="body2" color="textSecondary" sx={{whiteSpace:"nowrap"}}>{t("self-starter")}</Typography>}
              />
              <FormControlLabel value="alternator" control={<Radio size={"small"} />}
                label={<Typography variant="body2" color="textSecondary" sx={{whiteSpace:"nowrap"}}>{t("alternator")}</Typography>}
              />
            </RadioGroup>

            <Grid item xs={12} sm sx={{ flexGrow: 999, mt: 3 }}>
              <Button color="primary" fullWidth={false} size={"large"} sx={{ mr: 1 }}>
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
            {"Search results will appear here"}
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