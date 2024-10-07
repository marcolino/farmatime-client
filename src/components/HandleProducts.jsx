import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { DateTime } from "luxon";
import DialogConfirm from "./DialogConfirm";
import { apiCall } from "../libs/Network";
import { isBoolean, isString, isNumber, isArray, isObject } from "../libs/Misc";
import { useSnackbarContext } from "../providers/SnackbarProvider"; 
import { i18n } from "../i18n";

import {
  Box,
  Button,
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
import { TextFieldSearch, SectionHeader } from "./custom";
import { Search, Edit, Delete } from "@mui/icons-material";

const ProductTable = () => {
  //console.log("*** ProductTable rendered");
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext(); 
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const rowsPerPageOptions = [5, 10, 25, 50, 100];

  // to use localized dates
  const localizedDate = DateTime.fromJSDate(new Date())
    .setLocale(i18n.language)
    .toLocaleString(DateTime.DATETIME_FULL)
    ;
  
  useEffect(() => { // get all products on mount
    (async () => {
      const result = await apiCall("get", "/product/getAllProducts");
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        //showSnackbar("ok", "info");
        setProducts(result.products);
      }
    })();

    return () => {
      //console.log("*** ProductTable  unmounted");
    };
  }, []);


  // useEffect(() => {
  //   console.log("*** ProductTable mounted");
  //   let isMounted = true;
  //   const fetchProducts = async () => {
  //     const result = await apiCall("get", "/product/getAllProducts");
  //     if (result.err) {
  //       showSnackbar(result.message, result.status === 401 ? "warning" : "error");
  //     } else {
  //       //showSnackbar("ok", "info");
  //       if (isMounted) {
  //         setProducts(result.products);
  //       }
  //     }
  //   };
  
  //   fetchProducts();
  //   return () => {
  //     console.log("*** ProductTable  unmounted");
  //     isMounted = false;
  //   };
  // }, []);

  const removeProduct = (params) => {
    return apiCall("post", "/product/removeProduct", params);
  }

  const onEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };
  
  const onRemove = async(productId) => {
    removeProduct({ filter: [productId] }).then((data) => {
      if (data.err) {
        console.warn("removeProduct error:", data);
        showSnackbar(data.message ?? "Error removing product", "error");
        return;
      }
      // update the state to filter the removed product from the list
      setProducts(previousProducts => previousProducts.filter(product => product.id !== productId));
      setSelected([]);
    }).catch(error => {
      console.error(`Error removing product with id ${productId}: ${error.message}`);
      showSnackbar(t("Error removing product with id {{id}}: {{error}", {id: productId, error: error.message}), "error");
    });
  };

  const onBulkRemove = async(productIds, params) => {
    removeProduct({ filter: productIds, ...params }).then((data) => {
      if (data.err) {
        console.warn("bulkRemove product error:", data);
        showSnackbar(data.message ?? "Error bulk removing product", "error");
        return;
      }
      setProducts(previousProducts => previousProducts.filter(product => !productIds.includes(product.id)));
      setSelected([]);
      showSnackbar(t("Removed {{ count }} products", { count: productIds.length }), "success");
    }).catch(error => {
      console.error(`Error bulk removing ${productIds.length} products with ids ${productIds}: ${error.message}`);
      showSnackbar(t("Error bulk removing {{count}} products with ids: {{error}}", {count: productIds.length, error: error.message}), "error");
    });
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = products.map((product) => product.id);
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

  const onAction = (selectedIds, action, params) => {
    switch (action) {
      case "removeBulk":
        onBulkRemove(selectedIds);
        break;
      default:
        alert("unforeseen bulk action " + selectedIds.join(", ") + " " + action); // TODO...
        throw (new Error("unforeseen bulk action " + selectedIds.join(", ") + " " + action)); // TODO: what happens throwing here?
    }
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const [sortColumn, setSortColumn] = useState("mdaCode");
  const [sortDirection, setSortDirection] = useState("asc");
  
  const handleSort = (columnId) => () => {
    let newDirection = "asc";
  
    if (sortColumn === columnId && sortDirection === "asc") {
      newDirection = "desc";
    }
  
    setSortColumn(columnId);
    setSortDirection(newDirection);
  };

  const [action, setAction] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleConfirmOpen = (action) => { setAction(action); setConfirmOpen(true); }
  const handleConfirmClose = () => { setConfirmOpen(false); setAction(""); /*setSelected([]);*/ }
  const handleConfirm = () => { // perform the action on confirmation
    onAction(selected, action);
    handleConfirmClose();
  };

  const sortedProducts = useMemo(() => {
    let sortedProducts = [...products];
  
    if (sortColumn !== null) {
      sortedProducts.sort((a, b) => {
        if (isBoolean(a[sortColumn])) {
          let one = a[sortColumn];
          let two = b[sortColumn];
          if (one < two) return sortDirection === "asc" ? -1 : 1;
          if (one > two) return sortDirection === "asc" ? 1 : -1;
        }
        if (isString(a[sortColumn])) {
          let one = a[sortColumn]?.toLowerCase();
          let two = b[sortColumn]?.toLowerCase();
          if (one < two) return sortDirection === "asc" ? -1 : 1;
          if (one > two) return sortDirection === "asc" ? 1 : -1;
        }
        if (isNumber(a[sortColumn])) {
          let one = a[sortColumn];
          let two = b[sortColumn];
          if (one < two) return sortDirection === "asc" ? -1 : 1;
          if (one > two) return sortDirection === "asc" ? 1 : -1;
        }
        if (isArray(a[sortColumn])) {
          let one = a[sortColumn][0].priority;
          let two = b[sortColumn][0].priority;
          if (one < two) return sortDirection === "asc" ? -1 : 1;
          if (one > two) return sortDirection === "asc" ? 1 : -1;
        }
        if (isObject(a[sortColumn])) {
          // to be implemented if we will have object fields
          console.warn("unforeseen sort of \"object\" field type");
        }
        return 0;
      });
    }
    return sortedProducts;
  }, [products, sortColumn, sortDirection]);

  const sortButton = (props) => {
    return (
      <Typography component="span">
        { (sortColumn === props.column) ? (sortDirection === "asc" ? "▼" : "▲") : "▢" }
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
        justifyContent: "flex-end",
        width: "100%",
      }}>
        <TextFieldSearch
          label={t("Search")}
          value={filter}
          onChange={handleFilterChange}
          startIcon={<Search />}
          fullWidth={false}
          sx={{
            color: theme.palette.text.primary
          }}
        />
      </Box>

      <Paper sx={{
        overflow: "hidden",
        backgroundColor: theme.palette.background.default,
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
                    backgroundColor: theme.palette.secondary.main,
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
              {sortedProducts
                .filter((product) => product?.mdaCode?.toLowerCase().includes(filter.toLowerCase()))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => {
                  const isItemSelected = isSelected(product.id);
                  //console.log("KEY:", product.id);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, product.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={product.id}
                      selected={isItemSelected}
                      sx={(theme) => ({
                        "& td": {
                          backgroundColor: theme.palette.ochre.light,
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
                        <IconButton size="small" onClick={() => onEdit(product.id)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => onRemove(product.id)}>
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
            onClick={() => handleConfirmOpen("removeBulk")}
            disabled={selected.length === 0}
            sx={{mr: theme.spacing(2)}}
          >
            {t("Remove selected products")}
          </Button>
        </Box>
      </Paper>

      <DialogConfirm
        open={confirmOpen}
        onClose={handleConfirmClose}
        onCancel={handleConfirmClose} // TODO... ok?
        onConfirm={handleConfirm}
        title={t("Confirm Delete")}
        message={t("Are you sure you want to delete all {{count}} selected products?", { count: selected.length })}
        confirmText={t("Confirm")}
        cancelText={t("Cancel")}
      />
    </>
  );
};

export default React.memo(ProductTable);
