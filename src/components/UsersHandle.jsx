import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Container,
  Box,
  Checkbox,
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
import { TextFieldSearch, Button } from "./custom";
import { SectionHeader1, TableCellLastSticky } from "mui-material-custom";
import { Search, Edit, Delete, AccountCircle as ProfileIcon, } from "@mui/icons-material";
import DialogEmailCreation from "./DialogEmailCreation";
import { AuthContext } from "../providers/AuthContext";
import { apiCall } from "../libs/Network";
import LocalStorage from "../libs/LocalStorage";
import { isBoolean, isString, isNumber, isArray, isObject, isNull } from "../libs/Misc";
import { useDialog } from "../providers/DialogContext";
import { useSnackbarContext } from "../hooks/useSnackbarContext"; 
import StackedArrowsGlyph from "./glyphs/StackedArrows";


const UserTable = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [action, setAction] = useState("");
  const [refresh, setRefresh] = useState(false); // to force a refresh, for example when doing promoteToDealer

  const rowsPerPageOptions = [5, 10, 25, 50, 100];
  const rowsPerPageInitial = 10;

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const [sortColumn, setSortColumn] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");
  
  const [page, setPage] = useState(0);
  //const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    return parseInt(LocalStorage.get("usersRowsPerPage")) || rowsPerPageInitial; // persist to local storage
  });
  const [selected, setSelected] = useState([]);
  const [toBeRemoved, setToBeRemoved] = useState(null);

  useEffect(() => { // get all users on mount
    (async () => {
      const result = await apiCall("get", "/user/getAllUsersWithTokens");
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        setUsers(result.users);
        setRefresh(false);
      }
    })();
    return () => {
      //console.log("Users table unmounted");
    };
  }, [auth.user, refresh, showSnackbar]);

  // Check if current page is still valid (for example after a row deletion); otherwise go back one page
  useEffect(() => {
    if (page > 0 && page * rowsPerPage >= users.length) {
      setPage(page - 1);
    }
  }, [users, page, rowsPerPage]);
    
  const removeUser = async (params) => {
    const result = await apiCall("post", "/user/removeUser", params);
    if (result.err) {
      showSnackbar(result.message, "error");
      return false;
    }
    return true;
  }

  const sendEmailToUsers = async (params) => {
    const result = await apiCall("post", "/user/sendEmailToUsers", params);
    if (result.err) {
      showSnackbar(result.message, "error");
      return false;
    }
    showSnackbar(t("Email sent to {{count}} users", { count: params?.filter?.length }), "info");
    return true;
  }

  /*
  const onPromoteToDealer = async (userId) => {
    const result = await apiCall("post", "/user/promoteToDealer", { userId });
    if (result.err) {
      showSnackbar(result.message, "error");
      return false;
    } else {
      if (result.count > 0) {
        showSnackbar(t("User has been promoted to {{role}}", { role: t("dealer") }), "info");
      } else {
        showSnackbar(t("User was a {{role}} already", {role: t("dealer") }), "info");
      }
      setRefresh(true);
    }
    return true;
  };
  */

  const onEdit = (userId) => {
    navigate(`/edit-user/${userId}/userEdit`);
  };
  
  const onRemove = async (userId) => {
    const result = await removeUser({ filter: [userId] });
    if (result) {
      // update the state to filter the removed user from the list
      setUsers(previousUsers => previousUsers.filter(user => user._id !== userId));
      setToBeRemoved(null);
    }
  };

  const onBulkEmail = async (userIds, params) => {
    sendEmailToUsers({ filter: userIds, ...params });
  };

  const onBulkRemove = async (userIds, params) => {
    const usersCountBeforeRemove = users.length;
    const result = await removeUser({ filter: userIds, ...params });
    if (result) {
      setUsers(previousUsers => {
        const newUsers = previousUsers.filter(user => !userIds.includes(user._id));
        showSnackbar(t("Removed {{count}} users", { count: usersCountBeforeRemove - newUsers.length }), "success");
        return newUsers;
      });
      setSelected([]);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    LocalStorage.set("usersRowsPerPage", newRowsPerPage);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = users.map((user) => user._id);
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

  const onAction = (/*selectedIds, */action, params) => {
    switch (action) {
      case "remove":
        onRemove(toBeRemoved);
        break;
      case "removeBulk":
        onBulkRemove(selected/*selectedIds*/);
        break;
      case "emailBulk":
        onBulkEmail(selected/*selectedIds*/, params);
        break;
      default: // should not happen...
        showSnackbar(t("Unforeseen bulk action {{action}}", { action }), "error");
    }
  }

  const handleSort = (columnId) => () => {
    let newDirection = "asc";
    if (sortColumn === columnId && sortDirection === "asc") {
      newDirection = "desc";
    }
    setSortColumn(columnId);
    setSortDirection(newDirection);
  };

  const [emailCreationOpen, setEmailCreationOpen] = useState(false);
  const handleEmailCreationOpen = (action) => { setAction(action); setEmailCreationOpen(true); }
  const handleEmailCreationClose = () => { setEmailCreationOpen(false); setAction(""); }
  const handleEmailCreation = (params) => { // perform the action on email creation complete
    onAction(/*selected, */action, params);
    handleEmailCreationClose();
  };

  // sort users
  const sortedUsers = React.useMemo(() => {
    let sortedUsers = [...users];
  
    if (sortColumn !== null) {
      // split the array into two groups: one with defined values and one with undefined or null values
      const definedValues = users.filter(user => user[sortColumn] !== undefined);
      const undefinedValues = users.filter(user => user[sortColumn] === undefined);
    
      // sort the group with defined values
      definedValues.sort((a, b) => {
        if (isString(a[sortColumn])) {
          const valueA = a[sortColumn].toLowerCase();
          const valueB = b[sortColumn].toLowerCase();
          if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
          if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }
        if (isNumber(a[sortColumn]) || isBoolean(a[sortColumn])) {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
          if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
          if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }
        if (isArray(a[sortColumn])) { // only valid for roles...
          let one = a[sortColumn][0].priority;
          let two = b[sortColumn][0].priority;
          if (one < two) return sortDirection === "asc" ? -1 : 1;
          if (one > two) return sortDirection === "asc" ? 1 : -1;
          return 0;
        }
        if (isNull(a[sortColumn])) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (isObject(a[sortColumn])) {
          // to be implemented if we will have object fields
          console.warn(`sort of "object" field type for column ${sortColumn} is not implemented yet!`);
          return 0;
        }
        console.error(`sort of unknown field type for column ${sortColumn} is not implemented yet!`);
        return 0;
      });
    
      // merge the groups back together, placing undefined values according to the sort direction
      return sortDirection === "asc" ? [...definedValues, ...undefinedValues] : [...undefinedValues, ...definedValues];
    }
    return sortedUsers;
  }, [users, sortColumn, sortDirection]);

  // sort, filter and paginate users
  const getSortedFilteredPaginatedUsers = () => {
    if (!users || !users.length) {
      return [];
    }
    const filterLower = filter?.toLowerCase();
    const matches = (obj, fieldName) => {
      let fieldValue = obj[fieldName];
      // if (fieldName === "roles") {
      //   let a = 1;
      // }
      if (!obj) {
        return false;
      }
      if (!obj[fieldName]) {
        return false;
      }
      if (fieldName === "roles") {
        fieldValue = fieldValue.sort((a, b) => a["priority"] < b["priority"]).map(role => role["name"].toLowerCase()).join(", ")
      }
      return fieldValue.toString().toLowerCase().includes(filterLower);
    };
    return sortedUsers.filter(user =>
      matches(user, "firstName") ||
      matches(user, "lastName") ||
      matches(user, "email") ||
      matches(user, "phone") ||
      matches(user, "roles") ||
      matches(user, "fiscalCode") ||
      matches(user, "businessName")
    )
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };
  
  const sortButton = (props) => {
    return (
      <Typography component="span">
        {(sortColumn === props.column) ? (sortDirection === "asc" ? "▼" : "▲") : <StackedArrowsGlyph opacity={0.4 } />}
      </Typography>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <SectionHeader1>
        <ProfileIcon fontSize="large" /> {t("Users handling")}
      </SectionHeader1>

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
        //backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
      }}>
        <TableContainer sx={{ maxHeight: "max(12rem, calc(100vh - 32rem))" }}>
          {/* 12rem is the minimum vertical space for the table,
              26rem is the extimated vertical space for elements above and below the table */}
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow 
                sx={(theme) => ({
                  "& th": {
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.text.secondary,
                    py: 0,
                    whiteSpace: "nowrap",
                  }
                })}>
                <TableCell padding="checkbox">
                  <Checkbox
                    name="check_all"
                    indeterminate={selected.length > 0 && selected.length < users.length}
                    checked={users.length > 0 && selected.length === users.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell onClick={handleSort("firstName")}>
                  {t("First name")} {sortButton({ column: "firstName" })}
                </TableCell>
                <TableCell onClick={handleSort("lastName")}>
                  {t("Last name")} {sortButton({ column: "lastName" })}
                </TableCell>
                <TableCell onClick={handleSort("email")}>
                  {t("Email")} {sortButton({ column: "email" })}
                </TableCell>
                <TableCell>
                  {t("Phone")}
                </TableCell>
                <TableCell onClick={handleSort("roles")}>
                  {t("Roles")} {sortButton({ column: "roles" })}
                </TableCell>
                {/* <TableCell>
                  {t("Fiscal code")}
                </TableCell> */}
                {/* <TableCell onClick={handleSort("businessName")}>
                  {t("Business name")} {sortButton({ column: "businessName" })}
                </TableCell> */}
                <TableCellLastSticky>
                  {t("Actions")}
                </TableCellLastSticky>
              </TableRow>
            </TableHead>
            <TableBody>
              {getSortedFilteredPaginatedUsers(users, sortColumn, sortDirection).map(user => {
              // {sortedUsers
              //   .filter((user) => user?.firstName?.toLowerCase().includes(filter.toLowerCase()))
              //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              //   .map((user) => {
                  const isItemSelected = isSelected(user._id);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, user._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={user._id}
                      selected={isItemSelected}
                      sx={(theme) => ({
                        "& td": {
                          //backgroundColor: theme.palette.ochre.light,
                          color: theme.palette.common.text,
                          py: 0,
                        }
                      })}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox name="check_one" checked={isItemSelected} />
                      </TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.roles.sort((a, b) => a["priority"] < b["priority"]).map(role => role["name"]).join(", ")}</TableCell>
                      {/* <TableCell>{user.fiscalCode}</TableCell> */}
                      {/* <TableCell>{user.businessName}</TableCell> */}
                      <TableCellLastSticky>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title={t("Edit user")} arrow>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            fullWidth={false}
                            sx={{ px: 0.5, mr: 1 }}
                            onClick={() => onEdit(user._id)}
                          >
                            <Edit fontSize="small" />
                          </Button>
                        </Tooltip>
                        {/* <Tooltip title={t("Promote to {{role}}", {role: "dealer"})}>
                          <IconButton size="small" onClick={() => onPromoteToDealer(user._id)}>
                            <BuildCircle fontSize="small" />
                          </IconButton>
                        </Tooltip> */}
                        <Tooltip title={t("Remove user")} arrow>
                          <Button
                            variant="contained"
                            color="hinerit"
                            size="small"
                            fullWidth={false}
                            sx={{ px: 0.5, mr: 1 }}
                            onClick={() => showDialog({
                              onConfirm: () => onRemove(user._id),
                              title: t("Confirm Delete"),
                              message: t("Are you sure you want to delete selected {{count}} user?", { count: 1 }),
                              confirmText: t("Confirm"),
                              cancelText: t("Cancel"),
                            })}
                          >
                            <Delete fontSize="small" />
                          </Button>
                        </Tooltip>
                        </Box>
                      </TableCellLastSticky>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box sx={{ padding: theme.spacing(2) }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEmailCreationOpen("emailBulk")}
            disabled={selected.length === 0}
            fullWidth={false}
            sx={{ mr: theme.spacing(2), my: 0.3 }}
          >
            {t("Email users")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => showDialog({
              onConfirm: () => onBulkRemove(selected),
              title: t("Confirm Delete"),
              message: t("Are you sure you want to delete selected {{count}} user?", { count: selected.length }),
              confirmText: t("Confirm"),
              cancelText: t("Cancel"),
            })}
            disabled={selected.length === 0}
            fullWidth={false}
            sx={{ mr: theme.spacing(2), my: 0.3 }}
          >
            {t("Remove users")}
          </Button>
        </Box>
      </Paper>

      <DialogEmailCreation
        open={emailCreationOpen}
        onClose={handleEmailCreationClose}
        onConfirm={handleEmailCreation}
        message={t("Are you sure you want to send this email to {{count}} selected user?", { count: selected.length })}
        confirmText={t("Send email to {{count}} selected users", { count: selected.length })}
        cancelText={t("Cancel")}
      />
    </Container>
  );
};

export default React.memo(UserTable);
