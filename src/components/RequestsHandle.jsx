import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
//import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { JobContext } from "../providers/JobContext";
import { apiCall } from "../libs/Network";
import {
  Container,
  Box,
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
  Tooltip,
} from "@mui/material";
import { TextFieldSearch, Legenda } from "./custom";
import { SectionHeader1 } from "mui-material-custom";
import { History, Search, MenuOpen } from "@mui/icons-material";
import StackedArrowsGlyph from "./glyphs/StackedArrows";
import LocalStorage from "../libs/LocalStorage";
//import { useDialog } from "../providers/DialogContext";
import { isAdmin } from "../libs/Validation";
import { AuthContext } from "../providers/AuthContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";

const RequestsTable = () => {
  const theme = useTheme();
  //const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext();
  //const { showDialog } = useDialog();
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");
  const [requests, setRequests] = useState(null);
  // const { jobs, jobsError } = useContext(JobContext);
  const rowsPerPageOptions = [5, 10, 25, 50, 100];
  const rowsPerPageInitial = 10;
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const clickTimeoutRef = useRef(null);
  const { auth } = useContext(AuthContext);

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    return parseInt(LocalStorage.get("jobsRowsPerPage")) || rowsPerPageInitial; // persist to local storage
  });
  const [selected, setSelected] = useState([]);
  
  const statusTable = useMemo(() => [
    { sortid: "status-00", color: "rgba(33, 144, 255, 1)", status: "created", label: t("created"), },
    { sortid: "status-01", color: "rgba(0, 15, 150, 1)", status: "request", label: t("sent") },
    { sortid: "status-02", color: "rgba(21, 139, 0, 1)", status: "delivered", label: t("delivered") },
    { sortid: "status-03", color: "rgba(56, 225, 19, 1)", status: "opened", label: t("opened") },
            // TODO: add label to all rows, and add a bool flag "show"
    { sortid: "status-04", color: "rgba(224, 241, 131, 1)", status: "click" },
    { sortid: "status-05", color: "rgba(255, 0, 157, 1)", status: "invalid_email" },
    { sortid: "status-06", color: "rgba(204, 116, 0, 1)", status: "blocked" },
    { sortid: "status-07", color: "rgba(150, 40, 0, 1)", status: "spam" },
    { sortid: "status-08", color: "rgba(199, 53, 0, 1)", status: "unsubscribed" },
    { sortid: "status-09", color: "rgba(249, 0, 0, 1)", status: "error", label: t("error") },
    { sortid: "status-10", color: "rgba(199, 53, 0, 1)", status: "unforeseen" },
  ]);

  // Add this useEffect to force refresh when component mounts
  useEffect(() => {
    // This will trigger a re-render with fresh data from context
    if (requests) {
      console.log("RequestsTable mounted, requests count:", requests.length);
    } else {
      console.log("RequestsTable mounted, requests is null yet");
    }
  }, [requests]); // Empty dependency array means this runs once when component mounts

  // Get all requests on mount
  useEffect(() => {
    (async () => {
      // get all users request for admin users, and only her requests for other users
      const result = await apiCall("get", "/request/getRequests", isAdmin(auth.user) ? {} : {userId: auth.user.id});
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        //showSnackbar("ok", "info");
        setRequests(result.requests);
      }
    })();
    return () => {
      //console.log("RequestsTable unmounted");
    };
  }, []);
  
  // // Show job errors to the user
  // useEffect(() => {
  //   if (jobsError) {
  //     let message;
  //     if (jobsError.type === "load") {
  //       message = `${t("Failed to load jobs")}. ${t("Please try again")}.`;
  //     } else if (jobsError.type === "store") {
  //       message = `${t("Failed to store jobs")}. ${t("Please try again")}.`;
  //     } else {
  //       message = jobsError.message ?? "An unexpected error occurred.";
  //     }
  //     showSnackbar(message, "error");
  //   }
  // }, [jobsError, showSnackbar, t]);

  // Check if current page is still valid (for example after a row deletion); otherwise go back one page
  useEffect(() => {
    if (page > 0 && page * rowsPerPage >= requests.length) {
      setPage(page - 1);
    }
  }, [requests, page, rowsPerPage]);
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    const newRowsPerPage = parseInt(e.target.value);
    setRowsPerPage(newRowsPerPage);
    LocalStorage.set("jobsRowsPerPage", newRowsPerPage);
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelected = requests.map(request => request.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const clickTimeoutSet = (e, callback) => {
    const delayDuration = 400; // milliseconds (usually O.S. use this value to distinguish among click and double click)
    if (clickTimeoutRef.current) return; // ignore if timer already set
    clickTimeoutRef.current = setTimeout(() => {
      clickTimeoutRef.current = null;
      callback(); // Single click action delayed
    }, delayDuration);
  };

  const clickTimeoutReset = (e, callback) => {
    if (clickTimeoutRef.current) { // reset timer if set
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    callback(); // Double click action immediate
  };

  const handleClick = (e, id) => {
    clickTimeoutSet(e, () => onSelectRow(e, id)); // Handle single click, debouncing for a possible double click
  };

  const handleDoubleClick = (e, id) => {
    clickTimeoutReset(e, () => onMenuOpen(e, id)); // Handle double click
  };

  const onMenuOpen = (e, requestId) => {
    e.stopPropagation(); // Prevents bubbling to TableRow and select the row
    alert(`Showing details for request ${requestId} ...`);
  };
  
  const onSelectRow = (e, id) => {
    e.stopPropagation(); // Prevents bubbling to TableRow and select the row
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

  // const onSwitchActiveStatus = async (jobId) => {
  //   const jobsSwitched = getPlayPauseJob(jobId);
  //   if (await confirmJobsOnServer(jobsSwitched)) {
  //     setJobs(jobsSwitched);
  //   } else { // errors are handled with jobsError
  //     return;
  //   }
  // };

  // const onRemoveJob = async (jobId) => {
  //   const jobsAfterRemove = removeJob(jobId);
  //   if (await confirmJobsOnServer(jobsAfterRemove)) {
  //     setJobs(jobsAfterRemove);
  //     setSelected([]);
  //   } else { // errors are handled with jobsError
  //     return;
  //   }
  // };

  const handleSort = (columnId) => () => {
    let newDirection = "asc";
    if (sortColumn === columnId && sortDirection === "asc") {
      newDirection = "desc";
    }
    setSortColumn(columnId);
    setSortDirection(newDirection);
  };

  const getColumnValue = useCallback(
    (request, column) => {
      if (!request || !column) return undefined;

      switch (column) {
        case "status": {
          const statusMatch = statusTable.find(s => s.status === request.lastStatus).sortid;
          return statusMatch ?? "status-99";
        }
      
        case "userName":
          return [ // use lastName before than firstName, to sort by surname first
            request.userLastName || "",
            request.userFirstName || ""
          ].join(" ").trim();

        case "patientName":
          return [
            request.patientFirstName || "",
            request.patientLastName || ""
          ].join(" ").trim();

        case "patientEmail":
          return request.patientEmail;

        case "doctorName":
          return request.doctorName;

        case "doctorEmail":
          return request.doctorEmail;
        
        // direct props (id, status, etc.)
        default:
          return request[column];
      }
    },
    [statusTable]
  );
  // sort requests
  const sortedRequests = useMemo(() => {
    if (!requests) return [];
    if (!sortColumn) return [...requests];

    const valueFor = (request) => getColumnValue(request, sortColumn);

    const definedValues = requests.filter(j => valueFor(j) !== undefined && valueFor(j) !== null);
    const undefinedValues = requests.filter(j => valueFor(j) === undefined || valueFor(j) === null);

    definedValues.sort((a, b) => {
      const va = valueFor(a);
      const vb = valueFor(b);

      // strings
      if (typeof va === "string" && typeof vb === "string") {
        return sortDirection === "asc"
          ? va.localeCompare(vb)
          : vb.localeCompare(va);
      }

      // numbers
      if (typeof va === "number" && typeof vb === "number") {
        return sortDirection === "asc" ? va - vb : vb - va;
      }

      // booleans
      if (typeof va === "boolean" && typeof vb === "boolean") {
        return sortDirection === "asc"
          ? (va === vb ? 0 : va ? 1 : -1)
          : (va === vb ? 0 : va ? -1 : 1);
      }

      // arrays (example: sort by first element priority)
      if (Array.isArray(va) && Array.isArray(vb)) {
        const one = va[0]?.priority ?? 0;
        const two = vb[0]?.priority ?? 0;
        return sortDirection === "asc" ? one - two : two - one;
      }

      return 0;
    });

    return sortDirection === "asc"
      ? [...definedValues, ...undefinedValues]
      : [...undefinedValues, ...definedValues];
  }, [requests, sortColumn, sortDirection, getColumnValue]);

  // sort, filter and paginate jobs
  const getSortedFilteredPaginatedRequests = () => {
    console.log("REQUESTS:", requests);
    
    if (!requests || !requests.length) {
      return [];
    }

    const filterRequest = (request) => {
      if (!filter) {
        return true;
      }
      return (
        //matches(request, "id", filter) ||
        matches(request, "status", filter) ||
        //matches(request, "provider", filter) ||
        matches(request, "userName", filter) ||
        matches(request, "patientFirstName", filter) ||
        matches(request, "patientLastName", filter) ||
        matches(request, "doctor.name", filter) ||
        matches(request, "doctorEmail", filter) ||
        matches(request, "medicines[].name", filter) ||
        false
      );
    };

    const matches = (obj, fieldName, search) => {
      if (!obj) {
        return false;
      }
      if (!fieldName) {
        return false;
      }
      if (!search) {
        return false; // return false if no search term is provided, to return soon
      }

      search = search?.toLowerCase();

      // Split the fieldName by '.' to get each segment
      const segments = fieldName.split('.');

      let currentValue = obj;

      for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];

        // Check for array notation (e.g., "medicines[]")
        if (segment.endsWith('[]')) {
          const arrayPropertyName = segment.slice(0, -2); // Get "medicines"

          if (!currentValue || !Array.isArray(currentValue[arrayPropertyName])) {
            return false; // Property doesn't exist or is not an array
          }

          const array = currentValue[arrayPropertyName];

          // If this is the last segment, we're checking values directly within the array
          if (i === segments.length - 1) {
            // If the array itself contains the values to check
            return array.some(item =>
              item !== null && item !== undefined &&
              item.toString().toLowerCase().includes(search)
            );
          } else {
            // There are more segments after the array (e.g., "medicines[].name")
            const remainingFieldName = segments.slice(i + 1).join('.');
            // We need to check if *any* element in the array matches the remaining field
            return array.some(item =>
              matches(item, remainingFieldName, search) // Recursively call matches
            );
          }
        } else {
          // Standard nested object property
          if (!currentValue || typeof currentValue !== 'object' || currentValue[segment] === undefined) {
            return false; // Property doesn't exist or current value is not an object
          }
          currentValue = currentValue[segment];
        }
      }

      // If we reached here, it means we traversed all segments without encountering an array
      // and the last segment was a direct property.
      if (currentValue === null || currentValue === undefined) {
          return false;
      }

      return currentValue.toString().toLowerCase().includes(search);
    };
    
    return sortedRequests.
      filter(request => filterRequest(request))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };
    
  const sortButton = (props) => {
    return sortedFilteredPaginatedRequests.length > 1 ? (
      <Typography component="span">
        {(sortColumn === props.column) ? (sortDirection === "asc" ? "▼" : "▲") : <StackedArrowsGlyph opacity={0.4 } />}
      </Typography>
    ) : null;
  };

  const sortedFilteredPaginatedRequests = getSortedFilteredPaginatedRequests();

  //console.log("RequestsHandle - sortedFilteredPaginatedRequests:", sortedFilteredPaginatedRequests);

  if (requests === null) {
    return "loading..."; // still loading, show spinner
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SectionHeader1>
        <History fontSize="large" /> {t("Requests history")}
      </SectionHeader1>

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
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                    indeterminate={selected.length > 0 && selected.length < requests.length}
                    checked={requests.length > 0 && selected.length === requests.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>
                  {t("#")}
                </TableCell>
                <TableCell onClick={handleSort("status")}>
                  {t("Status")} {sortButton({ column: "status" })}
                </TableCell>
                {isAdmin(auth.user) && (
                  <TableCell onClick={handleSort("userName")}>
                    {t("User")} {sortButton({ column: "userName" })}
                  </TableCell>
                )}
                <TableCell onClick={handleSort("createdAt")}>
                  {t("Creation date")} {sortButton({ column: "createdAt" })}
                </TableCell>
                <TableCell onClick={handleSort("doctorName")}>
                  {t("Doctor name")} {sortButton({ column: "doctorName" })}
                </TableCell>
                {/* <TableCell onClick={handleSort("doctorEmail")}>
                  {t("Doctor email")} {sortButton({ column: "doctorEmail" })}
                </TableCell> */}
                <TableCell onClick={handleSort("patientName")}>
                  {t("Patient name")} {sortButton({ column: "patientName" })}
                </TableCell>
                {/* <TableCell onClick={handleSort("patientEmail")}>
                  {t("Patient email")} {sortButton({ column: "patientEmail" })}
                </TableCell> */}
                {/* <TableCell onClick={handleSort("provider")}>
                  {t("Provider")} {sortButton({ column: "provider" })}
                </TableCell> */}
                <TableCell /*onClick={handleSort("medicines")}*/>
                  {t("Medicines")} {/*sortButton({ column: "medicines" })*/}
                </TableCell>
                <TableCell>
                  {t("Actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedFilteredPaginatedRequests.map((request, index) => {
                const isItemSelected = isSelected(request._id);
                return (
                  <TableRow
                    hover
                    onClick={(e) => handleClick(e, request._id)}
                    onDoubleClick={(e) => handleDoubleClick(e, request._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={request._id}
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
                    <TableCell>
                      <Tooltip title={t("Progressive number")} arrow>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box component="span">{1 + index}</Box>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={t("Status of the request: {{status}}", { status: t(request.lastStatus) })} arrow>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            component="span"
                            sx={{
                              ml: 1,
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              //bgcolor: request.lastStatus === "created" ? "info.light" : "warning.light",
                              bgcolor: statusTable.find(s => s.status === request.lastStatus)?.color ?? "black"
                            }}
                          />
                          {/* &nbsp;{request.lastStatus} */}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    {isAdmin(auth.user) && (
                      <TableCell>{request.userFirstName} {request.userLastName}</TableCell>
                    )}
                    <TableCell>{request.createdAt.split("T")[0]}</TableCell>
                    <TableCell>{request.doctorName}</TableCell>
                    {/* <TableCell>{request.doctorEmail}</TableCell> */}
                    <TableCell>{request.patientFirstName} {request.patientLastName}</TableCell>
                    {/* <TableCell>{request.patientEmail}</TableCell> */}
                    {/* <TableCell>{request.provider}</TableCell> */}
                    <TableCell>{(request.medicines?.length === 0) ? '' : `(${request.medicines?.length}) ${request.medicines[0]?.name}${request.medicines?.length > 1 ? ',…' : ''}`}</TableCell>
                    <TableCell>
                      <Tooltip title={t("Show request details")} arrow>
                        <IconButton size="small" sx={{ mr: 1 }} onClick={(e) => onMenuOpen(e, request.id)}>
                          <MenuOpen fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {(requests.length > rowsPerPageOptions[0]) && ( // do not show pagination stuff if a few rows are present
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={requests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
        {/* <Box sx={{ padding: theme.spacing(2) }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth={false}
            //onClick={() => handleConfirmOpen("removeBulk")}
            onClick={() => showDialog({
              onConfirm: () => onBulkRemove(selected),
              title: t("Confirm Delete"),
              message: t("Are you sure you want to delete {{count}} selected job?", { count: selected.length }),
              confirmText: t("Confirm"),
              cancelText: t("Cancel"),
            })}
            disabled={selected.length === 0}
            sx={{mr: theme.spacing(2)}}
          >
            {t("Remove selected jobs")}
          </Button>
        </Box> */}

        </Paper>
        
      {sortedFilteredPaginatedRequests.length > 0 && (
        // <Box
        //   sx={{
        //     display: "flex",
        //     flexDirection: "column",
        //     justifyContent: "flex-end",
        //     height: "100%",
        //     mt: 2,
        //   }}
        // >
        //   <Legenda title={t("Status legenda")} items={statusTable} />
        // </Box>
      
        <Box sx={{ mt: 2 }}>
          <Legenda title={t("Status legenda")} items={statusTable} />
        </Box>
      )}
      </Box>

      {sortedFilteredPaginatedRequests.length === 0 && (
        <Box sx={{ padding: theme.spacing(2) }}>
          <Typography variant="body1" color="text.secondary" textAlign="center" fontStyle="italic" py={3}>
            {t("No requests present yet")}
          </Typography>
        </Box>
      )}
  
    </Container>
  );
};

export default React.memo(RequestsTable);
