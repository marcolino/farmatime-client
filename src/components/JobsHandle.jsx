import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
//import { DateTime } from "luxon";
import { JobContext } from "../providers/JobContext";
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
  //Chip,
} from "@mui/material";
import { TextFieldSearch, Button } from "./custom";
import { SectionHeader1 } from "mui-material-custom";
import { Search, Edit, Delete, AddCircleOutline, PlayArrow, Pause } from "@mui/icons-material";
import StackedArrowsGlyph from "./glyphs/StackedArrows";
//import { apiCall } from "../libs/Network";
//import { AuthContext } from '../providers/AuthContext';
import LocalStorage from "../libs/LocalStorage";
import { isBoolean, isString, isNumber, isArray, isObject, isNull } from "../libs/Misc";
import { useDialog } from "../providers/DialogContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";
// import { i18n } from "../i18n";

const JobsTable = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  //const { isLoggedIn } = useContext(AuthContext);
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");
  //const [action, setAction] = useState("");
  //const { job, setJob, jobsError } = useContext(JobContext);
  const { jobs, /*currentJobId, setCurrentJobId, setJob, addJob,*/ setJobs, removeJob, getPlayPauseJob, jobsError, confirmJobsOnServer, jobIsCompleted/*, markJobAsCreatedNow, markJobAsModifiedNow*/ } = useContext(JobContext);
  const rowsPerPageOptions = [5, 10, 25, 50, 100];
  const rowsPerPageInitial = 10;

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  
  //const [shouldConfirm, setShouldConfirm] = useState(false);

  const clickTimeoutRef = useRef(null);


  const newJob = () => {
    //addJob();
    navigate(`/job/new`);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    return parseInt(LocalStorage.get("jobsRowsPerPage")) || rowsPerPageInitial; // persist to local storage
  });
  const [selected, setSelected] = useState([]);
  //const [toBeRemoved, setToBeRemoved] = useState(null);
  
  // Add this useEffect to force refresh when component mounts
  useEffect(() => {
    // This will trigger a re-render with fresh data from context
    console.log("JobsTable mounted, jobs count:", jobs.length);
  }, []); // Empty dependency array means this runs once when component mounts

  // Show job errors to the user
  useEffect(() => {
    if (jobsError) {
      let message;
      if (jobsError.type === "load") {
        message = `${t("Failed to load jobs")}. ${t("Please try again")}.`;
      } else if (jobsError.type === "store") {
        message = `${t("Failed to store jobs")}. ${t("Please try again")}.`;
      } else {
        message = jobsError.message ?? "An unexpected error occurred.";
      }
      showSnackbar(message, "error");
    }
  }, [jobsError, showSnackbar, t]);

  // // Check user is logged in (T O D O: implement for all authenticated routes, possibly using a higher-order component)
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     console.warn('User must be logged in');
  //     navigate("/", { replace: true })
  //   }
  // }, [isLoggedIn]);

  // Confirm job changes
  // useEffect(() => {
  //   if (shouldConfirm) {
  //     (async () => {
  //       console.log("Confirming jobs on server...", jobs);
  //       if (!await confirmJobsOnServer()) {
  //         return;
  //       }
  //     })();
  //     setShouldConfirm(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [shouldConfirm]);

  // Check if current page is still valid (for example after a row deletion); otherwise go back one page
  useEffect(() => {
    if (page > 0 && page * rowsPerPage >= jobs.length) {
      setPage(page - 1);
    }
  }, [jobs, page, rowsPerPage]);
  
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
      const newSelected = jobs.map(job => job.id);
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
    clickTimeoutReset(e, () => onEdit(e, id)); // Handle double click
  };

  const onEdit = (e, jobId) => {
    e.stopPropagation(); // Prevents bubbling to TableRow and select the row
    navigate(`/job/${jobId}`);
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

  const onSwitchActiveStatus = async (jobId) => {
    const jobsSwitched = getPlayPauseJob(jobId);
    //setShouldConfirm(true); // Trigger confirmation on server
    //const jobsConfirmed = confirmJob(jobDraftConfirmed);
    if (await confirmJobsOnServer(jobsSwitched)) {
      setJobs(jobsSwitched);
    } else { // errors are handled with jobsError
      return;
    }
  };

  const onRemoveJob = async (jobId) => {
    const jobsAfterRemove = removeJob(jobId);
    if (await confirmJobsOnServer(jobsAfterRemove)) {
      setJobs(jobsAfterRemove);
      setSelected([]);
    } else { // errors are handled with jobsError
      return;
    }
  };

  const handleSort = (columnId) => () => {
    let newDirection = "asc";
    if (sortColumn === columnId && sortDirection === "asc") {
      newDirection = "desc";
    }
    setSortColumn(columnId);
    setSortDirection(newDirection);
  };

  // sort jobs
  const sortedJobs = React.useMemo(() => {
    let sortedJobs = [...jobs];

    if (sortColumn !== null) {
      sortedJobs.sort((a, b) => {
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
          console.warn(`sort of "object" field type for column ${sortColumn} is not implemented yet!`);
          return 0;
        }
        console.error(`sort of unknown field type for column ${sortColumn} is not implemented yet!`, isNull(a[sortColumn]), isNull(b[sortColumn]), typeof a[sortColumn], b[sortColumn]);
        return 0;
      });
    }
    return sortedJobs;
  }, [jobs, sortColumn, sortDirection]);

  // sort, filter and paginate jobs
  const getSortedFilteredPaginatedJobs = () => {
    console.log("JOBS:", jobs);
    
    if (!jobs || !jobs.length) {
      return [];
    }

    const filterJob = (job) => {
      if (!filter) {
        return true;
      }
      return (
        matches(job, "id", filter) ||
        matches(job, "patient.firstName", filter) ||
        matches(job, "patient.lastName", filter) ||
        matches(job, "patient.email", filter) ||
        matches(job, "doctor.name", filter) ||
        matches(job, "doctor.email", filter) ||
        matches(job, "medicines[].name", filter) ||
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
    
    return sortedJobs.
      filter(job => filterJob(job))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };
    
  const sortButton = (props) => {
    return sortedFilteredPaginatedJobs.length > 1 ? (
      <Typography component="span">
        {(sortColumn === props.column) ? (sortDirection === "asc" ? "▼" : "▲") : <StackedArrowsGlyph opacity={0.4 } />}
      </Typography>
    ) : null;
  };

  const sortedFilteredPaginatedJobs = getSortedFilteredPaginatedJobs(/*jobs, sortColumn, sortDirection*/);

  //console.log("JobsHandle - sortedFilteredPaginatedJobs:", sortedFilteredPaginatedJobs);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SectionHeader1>
        {t("Jobs list")}
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
        <Button
          onClick={newJob}
          fullWidth={false}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddCircleOutline />}
          //hideChildrenUpToBreakpoint="sm" // for mobile, hide text children
          sx={{
            width: "auto",
            minWidth: "auto",
            maxWidth: 200,
            flexShrink: 0,
            // whiteSpace: "nowrap",
            // flexShrink: 1,
            // minWidth: 136,
            // maxWidth: 150,
            // overflow: "hidden",
            // textOverflow: "ellipsis",
            mt: theme.spacing(0.3),
            px: theme.spacing(1),
            py: theme.spacing(0.8),
            ml: theme.spacing(2),
          }}
        >
          {t("New job")}
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
                    indeterminate={selected.length > 0 && selected.length < jobs.length}
                    checked={jobs.length > 0 && selected.length === jobs.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell onClick={handleSort("id")}>
                  {/* We name this column "N." ("Number") since these values are positive integers starting from 1,
                      that do not identify each row univocally, but just number the rows (it is more useful to the user);
                      when some row is moved around or deleted, this column values are recalculated, to mantain
                      natural progressivity; historically we use 'id' as an internal name */}
                  {t("Id")} {sortButton({ column: "id" })}
                </TableCell>
                {/* <TableCell onClick={handleSort("isActive")}>
                  {t("Status")} {sortButton({ column: "isActive" })}
                </TableCell> */}
                <TableCell onClick={handleSort("patientName")}>
                  {t("Patient name")} {sortButton({ column: "patientName" })}
                </TableCell>
                <TableCell onClick={handleSort("patientEmail")}>
                  {t("Patient email")} {sortButton({ column: "patientEmail" })}
                </TableCell>
                <TableCell onClick={handleSort("doctorName")}>
                  {t("Doctor name")} {sortButton({ column: "doctorName" })}
                </TableCell>
                <TableCell onClick={handleSort("doctorEmail")}>
                  {t("Doctor email")} {sortButton({ column: "doctorEmail" })}
                </TableCell>
                <TableCell /*onClick={handleSort("medicines")}*/>
                  {t("Medicines")} {/*sortButton({ column: "medicines" })*/}
                </TableCell>
                <TableCell>
                  {t("Actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedFilteredPaginatedJobs.map((job) => {
                const isItemSelected = isSelected(job.id);
                //console.log("ID:", job.id);
                console.log("MEDICINES 1:", job.medicines);
                console.log("MEDICINES 2:", job.medicines.length);
                console.log("MEDICINES 9:", (job.medicines?.length === 0) ? '' : `CCC(${job.medicines?.length}) ${job.medicines[0]?.name}${job.medicines?.length > 1 ? ',…' : ''}`);
                return (
                  <TableRow
                    hover
                    onClick={(e) => handleClick(e, job.id)}
                    onDoubleClick={(e) => handleDoubleClick(e, job.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={job.id}
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
                      <Tooltip title={job.isActive ? t("Job is active") : t("Job is paused")} arrow>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box component="span">{1 + job.id}</Box>
                          <Box
                            component="span"
                            sx={{
                              ml: 1,
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: job.isActive ? "success.light" : "warning.light",
                            }}
                          />
                        </Box>
                      </Tooltip>
                    </TableCell>
                    {/* <TableCell>
                      <Tooltip title={job.isActive ? t("Job is active") : t("Job is paused")} arrow>
                        <Chip
                          label={<IconButton size="small">
                            {job.isActive ? <PlayArrow fontSize="small" /> : <Pause fontSize="small" />}
                          </IconButton>}
                          color={job.isActive ? "primary" : "warning"}
                          variant="filled"
                          size="small"
                        />
                      </Tooltip>
                    </TableCell> */}
                    <TableCell>{job.patient?.firstName} {job.patient?.lastName}</TableCell>
                    <TableCell>{job.patient?.email}</TableCell>
                    <TableCell>{job.doctor?.name}</TableCell>
                    <TableCell>{job.doctor?.email}</TableCell>
                    <TableCell>{(job.medicines?.length === 0) ? '' : `(${job.medicines?.length}) ${job.medicines[0]?.name}${job.medicines?.length > 1 ? ',…' : ''}`}</TableCell>
                    <TableCell>
                      <Tooltip title={t("Edit job")} arrow>
                        <IconButton size="small" sx={{ mr: 1 }} onClick={(e) => onEdit(e, job.id)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={job.isActive ? t("Pause job") : t("Activate job")} arrow>
                        <IconButton size="small" sx={{ mr: 1 }} onClick={(e) => {
                          e.stopPropagation(); // Prevents bubbling to TableRow and select the row
                          if (!jobIsCompleted(job.id)) {
                            return showSnackbar(t("Job is not complete, can't be activated. Please edit the job and complete all requested fields"), "warning");
                          }
                          const title = job.isActive ? t("Pause job") : t("Activate job");
                          const what = job.isActive ? t("pause") : t("activate");
                          const explanation = job.isActive ?
                            t("Requests for this activity will not be sent anymore until it is reactivated") :
                            t("Requests for this activity will be sent again");
                          showDialog({
                            onConfirm: () => {
                              onSwitchActiveStatus(job.id);
                            },
                            title,
                            message:
                              t("Are you sure you want to {{what}} this job?", { what }) +
                              "\n\n" +
                              explanation + "."
                            ,
                            confirmText: t("Confirm"),
                            cancelText: t("Cancel"),
                          });
                        }}>
                          {job.isActive ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("Delete job")} arrow>
                        <IconButton
                          size="small"
                          sx={{ mr: 0 /* (last button has no right margin) */ }} 
                          onClick={(e) => {
                            e.stopPropagation(); // Stop row selection immediately
                            showDialog({
                              onConfirm: () => onRemoveJob(job.id)/*_removeJob(job.id)*/,
                              title: t("Confirm Delete"),
                              message: t("Are you sure you want to delete {{count}} selected job?", { count: 1 }),
                              confirmText: t("Confirm"),
                              cancelText: t("Cancel"),
                            });
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title={t("Job history")} arrow>
                        <IconButton
                          size="small"
                          sx={{ mr: 0 }} 
                          onClick={() => alert("work in progress...")}
                        >
                          <History fontSize="small" />
                        </IconButton>
                      </Tooltip> */}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {(jobs.length > rowsPerPageOptions[0]) && ( // do not show pagination stuff if a few rows are present
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={jobs.length}
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

      <Box sx={{ padding: theme.spacing(2) }}>
        {sortedFilteredPaginatedJobs.length === 0 && (
          <Typography variant="body1" color="text.secondary" textAlign="center" fontStyle="italic" py={3}>
            {t("No jobs present yet")}
          </Typography>
        )}
      </Box>

    </Container>
  );
};

export default React.memo(JobsTable);
