import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { DateTime } from "luxon";
import DialogConfirm from "./DialogConfirm";
import DialogEmailCreation from "./DialogEmailCreation";
import { apiCall } from "../libs/Network";
import { isBoolean, isString, isNumber, isArray, isObject, isNull } from "../libs/Misc";
//import { useSnackbar } from "../providers/SnackbarManager";
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

const UserTable = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext(); 
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [action, setAction] = useState("");

  const rowsPerPageOptions = [5, 10, 25, 50, 100];

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const [sortColumn, setSortColumn] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");
  

  // to use localized dates
  const localizedDate = DateTime.fromJSDate(new Date())
    .setLocale(i18n.language)
    .toLocaleString(DateTime.DATETIME_FULL)
  ;
  
  useEffect(() => { // get all users on mount
    (async() => {
      const result = await apiCall("get", "/user/getAllUsersWithFullInfo");
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        setUsers(result.users);
      }
    })();
    return () => {
      //console.log("UserTable  unmounted");
    };
  }, []); // empty dependency array: this effect runs once when the component mounts

  const removeUser = (params) => {
    return apiCall("post", "/user/removeUser", params);
  }

  const sendEmailToUsers = (params) => {
    return apiCall("post", "/user/sendEmailToUsers", params);
  }

  const onEdit = (userId) => {
    navigate(`/edit-user/${userId}/editUser`);
  };
  
  const onRemove = async(userId) => {
    removeUser({ filter: [userId] }).then((data) => {
      if (data.err) {
        console.warn("removeUser error:", data);
        showSnackbar(data.message ?? "Error removing user", "error");
        return;
      }
      // update the state to filter the removed user from the list
      setUsers(previousUsers => previousUsers.filter(user => user._id !== userId));
      setSelected([]);
    }).catch(error => {
      console.error(`Error deleting user with id ${userId}: ${error.message}`);
      showSnackbar(t("Error deleting user with id {{id}}: {{error}", {id: userId, error: error.message}), "error");
    });
  };

  const onBulkEmail = async(userIds, params) => {
    sendEmailToUsers({ filter: userIds, ...params }).then((data) => {
      if (data.err) {
        console.warn("sendEmailToUsers error:", data);
        if (data.message) {
          showSnackbar(data.message ?? "Error sending email to users", "error");
        }
        return;
      }
      showSnackbar(t("Email sent to {{count}} selected users", { count: userIds.length }), "success");
    }).catch(error => {
      console.error(`Error bulk sending email to ${userIds.length} users with ids ${userIds}: ${error.message}`);
      showSnackbar(t("Error bulk sending email to {{count}} users with ids: {{error}}", { count: userIds.length, error: error.message }), "error");
    });
  };

  const onBulkRemove = async(userIds, params) => {
    removeUser({ filter: userIds, ...params }).then((data) => {
      if (data.err) {
        console.warn("bulkRemove user error:", data);
        showSnackbar(data.message ?? "Error bulk removing user", "error");
        return;
      }
      setUsers(previousUsers => previousUsers.filter(user => !userIds.includes(user._id)));
      setSelected([]);
      showSnackbar(t("Removed {{count}} users", { count: userIds.length }), "success");
    }).catch(error => {
      console.error(`Error bulk removing ${userIds.length} users with ids ${userIds}: ${error.message}`);
      showSnackbar(t("Error bulk removing {{count}} users with ids: {{error}}", {count: userIds.length, error: error.message}), "error");
    });
  };

  const [page, setPage] = useState(0);
  //const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    return parseInt(localStorage.getItem("UsersRowsPerPage")) || 10; // persist to localstorage
  });
  const [selected, setSelected] = useState([]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    localStorage.setItem("UsersRowsPerPage", newRowsPerPage);
  };

  // const handleChangeRowsPerPageOLD = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

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

  const onAction = (selectedIds, action, params) => {
    switch (action) {
      case "removeBulk":
        onBulkRemove(selectedIds);
        break;
      case "emailBulk":
        onBulkEmail(selectedIds, params);
        break;
      default:
        alert("unforeseen bulk action " + selectedIds.join(", ") + " " + action); // TODO...
        throw (new Error("unforeseen bulk action " + selectedIds.join(", ") + " " + action)); // TODO: what happens throwing here?
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleConfirmOpen = (action) => { setAction(action); setConfirmOpen(true); }
  const handleConfirmClose = () => { setConfirmOpen(false); setAction(""); /*setSelected([]);*/ }
  const handleConfirm = () => { // perform the action on confirmation
    onAction(selected, action);
    handleConfirmClose();
  };

  const [emailCreationOpen, setEmailCreationOpen] = useState(false);
  const handleEmailCreationOpen = (action) => { setAction(action); setEmailCreationOpen(true); }
  const handleEmailCreationClose = () => { setEmailCreationOpen(false); setAction(""); }
  const handleEmailCreation = (params) => { // perform the action on email creation complete
    onAction(selected, action, params);
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
        if (isArray(a[sortColumn])) { // TODO: only valid for roles...
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
          console.warn(`sort of \"object\" field type for column ${sortColumn} is not implemented yet!`);
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

  useEffect(() => { // DEBUG ONLY
    console.log("users:", users);
    console.log("sortedUsers:", sortedUsers);
  }, [users, sortedUsers]);

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
        { (sortColumn === props.column) ? (sortDirection === "asc" ? "▼" : "▲") : "▢" }
      </Typography>
    );
  };

  return (
    <>
      <SectionHeader>
        {t("Users handling")}
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
                <TableCell>
                  {t("Fiscal Code")}
                </TableCell>
                <TableCell onClick={handleSort("businessName")}>
                  {t("Business name")} {sortButton({ column: "businessName" })}
                </TableCell>
                <TableCell>
                  {t("Actions")}
                </TableCell>
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
                          backgroundColor: theme.palette.ochre.light,
                          color: theme.palette.common.text,
                          py: 0,
                        }
                      })}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.roles.sort((a, b) => a["priority"] < b["priority"]).map(role => role["name"]).join(", ")}</TableCell>
                      <TableCell>{user.fiscalCode}</TableCell>
                      <TableCell>{user.businessName}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => onEdit(user._id)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => onRemove(user._id)}>
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
            sx={{mr: theme.spacing(2)}}
          >
            {t("Email selected users")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleConfirmOpen("removeBulk")}
            disabled={selected.length === 0}
            sx={{mr: theme.spacing(2)}}
          >
            {t("Remove selected users")}
          </Button>
        </Box>
      </Paper>

      <DialogConfirm
        open={confirmOpen}
        onClose={handleConfirmClose}
        onCancel={handleConfirmClose} // TODO... ok?
        onConfirm={handleConfirm}
        title={t("Confirm Delete")}
        message={t("Are you sure you want to delete all {{count}} selected users?", { count: selected.length })}
        confirmText={t("Confirm")}
        cancelText={t("Cancel")}
      />
      <DialogEmailCreation
        open={emailCreationOpen}
        onClose={handleEmailCreationClose}
        onConfirm={handleEmailCreation}
        //title={t("Create and send email")}
        message={t("Are you sure you want to send this email to all the {{count}} selected users?", { count: selected.length })}
        //subjectLabel={t("Subject")}
        //bodyLabel={t("Body")}
        confirmText={t("Send email to {{count}} selected users", { count: selected.length })}
        cancelText={t("Cancel")}
      />
    </>
  );
};

export default React.memo(UserTable);
