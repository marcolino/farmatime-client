import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { DateTime } from "luxon";
import {
  Box,
  //Button,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from "@mui/material";
import { TextFieldSearch, SectionHeader, Button } from "./custom";
import { Search, Edit, Delete, AddCircleOutline } from "@mui/icons-material";
import StackedArrowsGlyph from "./glyphs/StackedArrows";
import { apiCall } from "../libs/Network";
import LocalStorage from "../libs/LocalStorage";
import { isBoolean, isString, isNumber, isArray, isObject, isNull } from "../libs/Misc";
import { useDialog } from "../providers/DialogContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";
import { StyledPaper, StyledBox } from './JobStyles';
import { i18n } from "../i18n";

const JobsTable = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  //const [action, setAction] = useState("");

  const rowsPerPageOptions = [5, 10, 25, 50, 100];

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const [sortColumn, setSortColumn] = useState("mdaCode");
  const [sortDirection, setSortDirection] = useState("asc");
  
  // to use localized dates
  const localizedDate = DateTime.fromJSDate(new Date())
    .setLocale(i18n.language)
    .toLocaleString(DateTime.DATETIME_FULL)
  ;
  
  useEffect(() => { // get all products on mount
    (async () => {
      const result = await apiCall("get", "/product/getProducts");
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        //showSnackbar("ok", "info");
        setProducts(result.products);
      }
    })();
    return () => {
      //console.log("ProductTable unmounted");
    };
  }, []);

  const newProduct = () => {
    navigate(`/edit-product/<new>`);
  };

  const removeProduct = (params) => {
    return apiCall("post", "/product/removeProduct", params);
  }

  const onEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };
  
  const onRemove = async (productId) => {
    removeProduct({ filter: [productId] }).then((data) => {
      if (data.err) {
        console.warn("removeProduct error:", data);
        showSnackbar(t("Error removing product: {{err}}", {err: data.message}), "error");
        return;
      }
      // update the state to filter the removed product from the list
      setProducts(previousProducts => previousProducts.filter(product => product._id !== productId));
      //setToBeRemoved(null);
    }).catch(err => {
      console.error(`Error removing product with id ${productId}: ${err.message}`);
      showSnackbar(t("Error removing product with id {{id}}: {{err}", {id: productId, err: err.message}), "error");
    });
  };

  const onBulkRemove = async (productIds, params) => {
    removeProduct({ filter: productIds, ...params }).then((data) => {
      if (data.err) {
        console.warn("bulkRemove product error:", data);
        showSnackbar(t("Error bulk removing product: {{err}}", { err: data.message }), "error");
        return;
      }
      setProducts(previousProducts => previousProducts.filter(product => !productIds.includes(product._id)));
      setSelected([]);
      showSnackbar(t("Removed {{ count }} products", { count: productIds.length }), "success");
    }).catch(err => {
      console.error(`Error bulk removing ${productIds.length} products with ids ${productIds}: ${err.message}`);
      showSnackbar(t("Error bulk removing {{count}} products: {{err}}", {count: productIds.length, err: err.message}), "error");
    });
  };

  const [page, setPage] = useState(0);
  //const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    return parseInt(LocalStorage.get("productsRowsPerPage")) || 10; // persist to local storage
  });
  const [selected, setSelected] = useState([]);
  //const [toBeRemoved, setToBeRemoved] = useState(null);
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    LocalStorage.set("productsRowsPerPage", newRowsPerPage);
  };

  // const handleChangeRowsPerPageOLD = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = products.map((product) => product._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  // const onAction = (/*selectedIds, */action, params) => {
  //   switch (action) {
  //     case "remove":
  //       onRemove(toBeRemoved);
  //       break;
  //     case "removeBulk":
  //       onBulkRemove(selected);
  //       break;
  //     default: // should not happen...
  //       showSnackbar(t("Unforeseen bulk action {{action}}", { action }), "error");
  //   }
  // }

  const handleSort = (columnId) => () => {
    let newDirection = "asc";
    if (sortColumn === columnId && sortDirection === "asc") {
      newDirection = "desc";
    }
    setSortColumn(columnId);
    setSortDirection(newDirection);
  };

  // const [confirmOpen, setConfirmOpen] = useState(false);
  // const handleConfirmOpen = (action, productId) => { setAction(action); setToBeRemoved(productId); setConfirmOpen(true); }
  // const handleConfirmClose = () => { setConfirmOpen(false); setAction(""); /*setSelected([]);*/ }
  // const handleConfirm = () => { // perform the action on confirmation
  //   onAction(/*selected, */action);
  //   handleConfirmClose();
  // };
  
  // sort products
  const sortedProducts = React.useMemo(() => {
    let sortedProducts = [...products];
  
    if (sortColumn !== null) {
      sortedProducts.sort((a, b) => {
        if (isString(a[sortColumn])) {
          let one = a[sortColumn]?.toLowerCase();
          let two = b[sortColumn]?.toLowerCase();
          if (one < two) return sortDirection === "asc" ? -1 : 1;
          if (one > two) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }
        if (isNumber(a[sortColumn]) || isBoolean(a[sortColumn])) {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
          if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }
        if (isArray(a[sortColumn])) {
          let one = a[sortColumn][0].priority;
          let two = b[sortColumn][0].priority;
          if (one < two) return sortDirection === "asc" ? -1 : 1;
          if (one > two) return sortDirection === "asc" ? 1 : -1;
        }
        if (isNull(a[sortColumn])) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (isObject(a[sortColumn])) {
          // to be implemented if we will have object fields
          console.warn(`sort of \"object\" field type for column ${sortColumn} is not implemented yet!`);
          return 0;
        }
        console.error(`sort of unknown field type for column ${sortColumn} is not implemented yet!`);
        return 0;
      });
    }
    return sortedProducts;
  }, [products, sortColumn, sortDirection]);

  // sort, filter and paginate products
  const getSortedFilteredPaginatedProducts = () => {
    if (!products || !products.length) {
      return [];
    }
    const filterLower = filter?.toLowerCase();

    const filterProduct = (product) => {
      if (!filter) {
        return true;
      }
      return false ||
        matches(product, "mdaCode") ||
        matches(product, "oemCode") ||
        matches(product, "make") ||
        matches(product, "application") ||
        matches(product, "kw") ||
        matches(product, "volt") ||
        matches(product, "ampere") ||
        matches(product, "teeth") ||
        matches(product, "type") ||
        matches(product, "notes")
      ;
    };

    const matches = (obj, fieldName) => {
      if (!obj) {
        return false;
      }
      if (!obj[fieldName]) {
        return false;
      }
      return obj[fieldName].toString().toLowerCase().includes(filterLower);
    };
    
    return sortedProducts.
      filter(product => filterProduct(product))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };
    
  const sortButton = (props) => {
    return (
      <Typography component="span">
        {(sortColumn === props.column) ? (sortDirection === "asc" ? "▼" : "▲") : <StackedArrowsGlyph opacity={0.4 } />}
      </Typography>
    );
  };

  //console.log("*** ProductsTable state:", state);
  //console.log("*** ProductsTable props:", props);
  return (
    <>
      <SectionHeader>
        {t("Products handling")}
      </SectionHeader>

      <Box sx={{
        my: theme.spacing(2),
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
      }}>
        <TextFieldSearch
          label={t("Search")}
          value={filter}
          size="small"
          margin="dense" // matches compact Button appearance
          onChange={handleFilterChange}
          startIcon={<Search />}
          fullWidth={false}
          sx={{ color: theme.palette.text.primary }}
        />
        <Button
          onClick={newProduct}
          fullWidth={false}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddCircleOutline />}
          hideChildrenUpToBreakpoint="sm" // for mobile, hide text children
          sx={{
            mt: theme.spacing(0.3),
            py: theme.spacing(0.8),
            ml: theme.spacing(2),
          }}
        >
          {t("New product")}
        </Button>
      </Box>

      <Paper sx={{
        overflow: "hidden",
        bgColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
      }}>
        <TableContainer sx={{ maxHeight: "max(12rem, calc(100vh - 26rem))" }}>
          {/* 12rem is the minimum vertical space for the table,
              26rem is the extimated vertical space for elements above and below the table */}
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow 
                sx={(theme) => ({
                  "& th": {
                    bgColor: theme.palette.secondary.main,
                    color: theme.palette.common.black,
                    py: 0,
                    whiteSpace: "nowrap",
                  }
                })}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < products.length}
                    checked={products.length > 0 && selected.length === products.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell onClick={handleSort("mdaCode")}>
                  {t("MDA code")} {sortButton({ column: "mdaCode" })}
                </TableCell>
                <TableCell onClick={handleSort("oemCode")}>
                  {t("OEM code")} {sortButton({ column: "oemCode" })}
                </TableCell>
                <TableCell onClick={handleSort("make")}>
                  {t("Make")} {sortButton({ column: "make" })}
                </TableCell>
                {/* <TableCell onClick={handleSort("models")}>
                  {t("Models")} {sortButton({ column: "models" })}
                </TableCell> */}
                <TableCell onClick={handleSort("application")}>
                  {t("Application")} {sortButton({ column: "application" })}
                </TableCell>
                <TableCell onClick={handleSort("kw")}>
                  {t("kW")} {sortButton({ column: "kw" })}
                </TableCell>
                <TableCell onClick={handleSort("volt")}>
                  {t("Volt")} {sortButton({ column: "volt" })}
                </TableCell>
                <TableCell onClick={handleSort("ampere")}>
                  {t("Ampere")} {sortButton({ column: "ampere" })}
                </TableCell>
                <TableCell>
                  {t("Teeth")}
                </TableCell>
                <TableCell onClick={handleSort("type")}>
                  {t("Type")} {sortButton({ column: "type" })}
                </TableCell>
                <TableCell>
                  {t("Notes")}
                </TableCell>
                <TableCell>
                  {t("Actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getSortedFilteredPaginatedProducts(products, sortColumn, sortDirection).map(product => {
              // {sortedProducts
              //   .filter((product) => product?.mdaCode?.toLowerCase().includes(filter.toLowerCase()))
              //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              //   .map((product) => {
                  const isItemSelected = isSelected(product._id);
                  //console.log("KEY:", product._id);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, product._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={product._id}
                      selected={isItemSelected}
                      sx={(theme) => ({
                        "& td": {
                          bgColor: theme.palette.ochre.light,
                          color: theme.palette.common.text,
                          py: 0,
                        }
                      })}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell>{product.mdaCode}</TableCell>
                      <TableCell>{product.oemCode}</TableCell>
                      <TableCell>{product.make}</TableCell>
                      {/* <TableCell>{product.models.sort((a, b) => a < b).join(", ")}</TableCell> */}
                      <TableCell>{product.application}</TableCell>
                      <TableCell>{product.kw}</TableCell>
                      <TableCell>{product.volt}</TableCell>
                      <TableCell>{product.ampere}</TableCell>
                      <TableCell>{product.teeth}</TableCell>
                      <TableCell>{product.type}</TableCell>
                      <TableCell>{product.notes}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => onEdit(product._id)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => showDialog({
                          onConfirm: () => onRemove(product._id),
                          title: t("Confirm Delete"),
                          message: t("Are you sure you want to delete {{count}} selected product?", { count: 1 }),
                          confirmText: t("Confirm"),
                          cancelText: t("Cancel"),
                        })}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box sx={{ padding: theme.spacing(2) }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth={false}
            //onClick={() => handleConfirmOpen("removeBulk")}
            onClick={() => showDialog({
              onConfirm: () => onBulkRemove(selected),
              title: t("Confirm Delete"),
              message: t("Are you sure you want to delete {{count}} selected product?", { count: selected.length }),
              confirmText: t("Confirm"),
              cancelText: t("Cancel"),
            })}
            disabled={selected.length === 0}
            sx={{mr: theme.spacing(2)}}
          >
            {t("Remove selected products")}
          </Button>
        </Box>
      </Paper>

      {/* <DialogConfirm
        open={confirmOpen}
        onClose={handleConfirmClose}
        onCancel={handleConfirmClose}
        onConfirm={handleConfirm}
        title={t("Confirm Delete")}
        message={t("Are you sure you want to delete selected product(s)?")}
        confirmText={t("Confirm")}
        cancelText={t("Cancel")}
      /> */}
    </>
  );
};

export default React.memo(JobsTable);
