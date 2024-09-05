import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import DialogConfirm from "./DialogConfirm";
import DialogEmailCreation from "./DialogEmailCreation";
import { FormTitle } from "./FormElements";
import moment from "moment";
import "moment/locale/it"; // TODO: import all needed locales... (!!!)
import { getUsers, removeUser, sendEmailToUsers } from "../libs/Fetch";
import { toast } from "./Toast";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
} from "@material-ui/core";
import { Search, Edit, Delete } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTableCell-head": {
      color: theme.palette.header.color,
      backgroundColor: theme.palette.header.backgroundColor,
    },
  },
  outlinedInput: {
    "& $notchedOutline": {
      borderColor: "lightgray",
    },
    "&$focused $notchedOutline": {
      borderColor: "blue",
    },
  },
  notchedOutline: {},
  focused: {},
  table: {
    fontSize: "0.9em",
    minWidth: 650,
  },
  tableContainer: {
    maxHeight: 440,
  },
  tableHeader: {
    backgroundColor: theme.palette.background.default,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  tableCell: {
    padding: "2px 16px",
  },
  actionsCell: {
    whiteSpace: "nowrap",
  },
  headerCheckbox: {
    paddingLeft: "20px",
  },
  title: {
    padding: 8,
    paddingRight: 24,
    borderRadius: 4,
    textAlign: "right",
    color: theme.palette.title.color,
    backgroundColor: theme.palette.title.backgroundColor,
  },
  filter: {
    padding: 2,
    textAlign: "right",
  },
  sortButton: {
    marginLeft: 12,
    // backgroundColor: "green",
  },
  sortButtonActive: {
    // fontSize: "1.5em",
    opacity: "80%"
  },
  sortButtonInactive: {
    opacity: "40%",
  },
  bulkButton: {
    marginRight: 8,
  },
  removeButton: {
    //color: theme.palette.danger.color,
    backgroundColor: theme.palette.danger.backgroundColor,
  },
}));


const UserTable = (/*{ users, onEdit, onRemove, onBulkAction }*/) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getUsers({}).then((data) => {
      if (!data.ok) {
        console.warn("getUsers error:", data);
        if (data.message) {
          toast.error(t(data.message)); 
        }
        return;
      }
      //toast.info(`${data.users.length} users loaded`);
      setUsers(data.users);
      console.log("getUsers success:", data);
    });
  }, [t]);
  
  const onEdit = (userId) => {
    //alert("onEdit " + userId);
    //history.push("/edit-user", { data: { userId } });
    history.push(`/edit-user/${userId}`);
  };
  
  const onRemove = async (userId) => {
    //removeUser({ filter: { _id: userId } }).then((data) => {
    removeUser({ filter: [userId] }).then((data) => {
        if (!data.ok) {
        console.warn("removeUser error:", data);
        if (data.message) {
          toast.error(t(data.message));
        }
        return;
      }
      // update the state to filter the removed user from the list
      setUsers(previousUsers => previousUsers.filter(user => user._id !== userId));
    }).catch(error => {
      console.error(`Error deleting user with id ${userId}: ${error.message}`);
      toast.error(`${t("Error deleting user with id")} ${userId}: ${error.message}`);
    });
  };

  const onBulkEmail = async (userIds, params) => {
    sendEmailToUsers({ filter: userIds, ...params }).then((data) => {
    //sendEmailToUsers({ _id: { $in: userIds }}, ...params).then((data) => {
      if (!data.ok) {
        console.warn("sendEmailToUsers error:", data);
        if (data.message) {
          toast.error(data.message);
        }
        return;
      }
      toast.success(t("Email sent to {{count}} selected users", { count: userIds.length }));
    }).catch(error => {
      console.error(`Error bulk sending email to users with ids ${userIds}: ${error.message}`);
      toast.error(`${t("Error bulk sending email to users with ids")} ${userIds}: ${error.message}`);
    });
  };

  const onBulkRemove = async (userIds, params) => {
    removeUser({ filter: userIds, ...params }).then((data) => {
    //removeUser({ filter: { _id: { "$in": userIds } } }).then((data) => {
        if (!data.ok) {
        console.warn("removeUser error:", data);
        if (data.message) {
          toast.error(data.message);
        }
        return;
      }
      // update the state to filter the removed user from the list
      setUsers(previousUsers => previousUsers.filter(user => !userIds.includes(user._id)));
    }).catch(error => {
      console.error(`Error bulk deleting users with ids ${userIds}: ${error.message}`);
      toast.error(`${t("Error bulk deleting users with ids")} ${userIds}: ${error.message}`);
    });
  };

  moment.locale("it");

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
    }
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const [sortColumn, setSortColumn] = useState("lastName");
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

  const [emailCreationOpen, setEmailCreationOpen] = useState(false);
  const handleEmailCreationOpen = (action) => { setAction(action); setEmailCreationOpen(true); }
  const handleEmailCreationClose = () => { setEmailCreationOpen(false); setAction(""); }
  const handleEmailCreation = (params) => { // perform the action on email creation complete
    onAction(selected, action, params);
    handleEmailCreationClose();
  };

  const sortedUsers = React.useMemo(() => {
    let sortedUsers = [...users];
  
    if (sortColumn !== null) {
      sortedUsers.sort((a, b) => {
        let one = a[sortColumn]?.toLowerCase();
        let two = b[sortColumn]?.toLowerCase();
        if (one < two) return sortDirection === "asc" ? -1 : 1;
        if (one > two) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedUsers;
  }, [users, sortColumn, sortDirection]);

  const sortButton = (props) => {
    return (
      <Typography component="span" className={[classes.sortButton, (sortColumn === props.column) ? classes.sortButtonActive : classes.sortButtonInactive]}>
        { (sortColumn === props.column) ? (sortDirection === "asc" ? "▼" : "▲") : "▢" }
      </Typography>
    );
  };

  return (
    <>
      <FormTitle>
        {t("Users handling")}
      </FormTitle>

      <Box sx={{ marginBottom: 8}} className={classes.filter}>
        <TextField
          label={t("Filter users")}
          value={filter}
          onChange={handleFilterChange}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
            classes: { root: classes.outlinedInput, notchedOutline: classes.notchedOutline },
          }}
          sx={{ marginLeft: "auto", marginRight: 2 }}
        />
      </Box>
      <Paper>
        <TableContainer className={[classes.root, classes.tableContainer]}>
          <Table stickyHeader className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" className={classes.tableHeader}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < users.length}
                    checked={users.length > 0 && selected.length === users.length}
                    onChange={handleSelectAllClick}
                    className={classes.headerCheckbox}
                  />
                </TableCell>
                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`} onClick={handleSort("firstName")}>
                  {t("First name")} {sortButton({ column: "firstName" })}
                </TableCell>
                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`} onClick={handleSort("lastName")}>
                  {t("Last name")} {sortButton({ column: "lastName" })}
                </TableCell>
                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`} onClick={handleSort("email")}>
                  {t("Email")} {sortButton({ column: "email" })}
                </TableCell>
                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}>
                  {t("Phone")}
                </TableCell>
                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}>
                  {t("Roles")}
                </TableCell>
                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}>
                  {t("Fiscal Code")}
                </TableCell>
                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`} onClick={handleSort("businessName")}>
                  {t("Business name")} {sortButton({ column: "businessName" })}
                </TableCell>
                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}>
                  {t("Actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers
                .filter((user) => user.firstName.toLowerCase().includes(filter.toLowerCase()))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
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
                    >
                      <TableCell padding="checkbox" className={classes.tableCell}>
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell className={classes.tableCell}>{user.firstName}</TableCell>
                      <TableCell className={classes.tableCell}>{user.lastName}</TableCell>
                      <TableCell className={classes.tableCell}>{user.email}</TableCell>
                      <TableCell className={classes.tableCell}>{user.phone}</TableCell>
                      <TableCell className={classes.tableCell}>{user.roles.sort((a, b) => a["priority"] < b["priority"]).map(role => role["name"]).join(", ")}</TableCell>
                      <TableCell className={classes.tableCell}>{user.fiscalCode}</TableCell>
                      <TableCell className={classes.tableCell}>{user.businessName}</TableCell>
                      <TableCell className={`${classes.tableCell} ${classes.actionsCell}`}>
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box sx={{ padding: 8 }}>
          <Button
            variant="contained"
            color="secondary"
            className={[classes.bulkButton]}
            onClick={() => handleEmailCreationOpen("emailBulk")}
            disabled={selected.length === 0}
          >
            {t("Email selected users")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={[classes.bulkButton, classes.removeButton]}
            onClick={() => handleConfirmOpen("removeBulk")}
            disabled={selected.length === 0}
          >
            {t("Remove selected users")}
          </Button>
        </Box>
      </Paper>

      <DialogConfirm
        open={confirmOpen}
        onClose={handleConfirmClose}
        onConfirm={handleConfirm}
        title={t("Confirm Delete")}
        // TODO: handle singular/plural
        message={t("Are you sure you want to delete all the {{count}} selected users?", { count: selected.length })}
        confirmText={t("Confirm")}
        cancelText={t("Cancel")}
      />
      <DialogEmailCreation
        open={emailCreationOpen}
        onClose={handleEmailCreationClose}
        onConfirm={handleEmailCreation}
        title={t("Create email")}
        // TODO: handle singular/plural
        //message={t("Are you sure you want to send this email to all the {{count}} selected users?", { count: selected.length })}
        subjectLabel={t("Subject")}
        bodyLabel={t("Body")}
        confirmText={t("Send email to selected users")}
        cancelText={t("Cancel")}
      />
    </>
  );
};

export default React.memo(UserTable);