import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
//import { DateTime } from "luxon";
import { JobContext } from "../providers/JobContext";
import {
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
} from "@mui/material";
import { TextFieldSearch, Button } from "./custom";
import { SectionHeader1 } from 'mui-material-custom';
import { Search, Edit, Delete, AddCircleOutline } from "@mui/icons-material";
import StackedArrowsGlyph from "./glyphs/StackedArrows";
//import { apiCall } from "../libs/Network";
import LocalStorage from "../libs/LocalStorage";
import { isBoolean, isString, isNumber, isArray, isObject, isNull } from "../libs/Misc";
import { useDialog } from "../providers/DialogContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";
// import { i18n } from "../i18n";

const JobsTable = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");
  //const [action, setAction] = useState("");
  //const { job, setJob, jobError } = useContext(JobContext);
  const { jobs, setJobs, currentJobId, setCurrentJobId, jobError } = useContext(JobContext);
  const rowsPerPageOptions = [5, 10, 25, 50, 100];

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  

  const newJob = () => {
    // TODO: use setCurrentJobId to set a NEW job id (the biggest found + 1)
    navigate(`/job-new`);
  };

  const removeJob = (params) => {
    // TODO: remove job from jobs
    alert(`removing job ${params}`);
  }

  const onEdit = (jobId) => {
    navigate(`/job/${jobId}`);
  };
  
  // const onRemove = async (jobId) => {
  //   removeJob({ filter: [jobId] }).then((data) => {
  //     if (data.err) {
  //       console.warn("removeJob error:", data);
  //       showSnackbar(t("Error removing job: {{err}}", {err: data.message}), "error");
  //       return;
  //     }
  //     // update the state to filter the removed job from the list
  //     setJobs(previousJobs => previousJobs.filter(job => job.id !== jobId));
  //     //setToBeRemoved(null);
  //   }).catch(err => {
  //     console.error(`Error removing job with id ${jobId}: ${err.message}`);
  //     showSnackbar(t("Error removing job with id {{id}}: {{err}", {id: jobId, err: err.message}), "error");
  //   });
  // };

  // const onBulkRemove = async (jobIds, params) => {
  //   removeJob({ filter: jobIds, ...params }).then((data) => {
  //     if (data.err) {
  //       console.warn("bulkRemove job error:", data);
  //       showSnackbar(t("Error bulk removing job: {{err}}", { err: data.message }), "error");
  //       return;
  //     }
  //     setJobs(previousJobs => previousJobs.filter(job => !jobIds.includes(job.id)));
  //     setSelected([]);
  //     showSnackbar(t("Removed {{ count }} jobs", { count: jobIds.length }), "success");
  //   }).catch(err => {
  //     console.error(`Error bulk removing ${jobIds.length} jobs with ids ${jobIds}: ${err.message}`);
  //     showSnackbar(t("Error bulk removing {{count}} jobs: {{err}}", {count: jobIds.length, err: err.message}), "error");
  //   });
  // };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    return parseInt(LocalStorage.get("jobsRowsPerPage")) || 10; // persist to local storage
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
    LocalStorage.set("jobsRowsPerPage", newRowsPerPage);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = jobs.map(job => job.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
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
        console.error(`sort of unknown field type for column ${sortColumn} is not implemented yet!`);
        return 0;
      });
    }
    return sortedJobs;
  }, [jobs, sortColumn, sortDirection]);

  // sort, filter and paginate jobs
  const getSortedFilteredPaginatedJobs = () => {
    if (!jobs || !jobs.length) {
      return [];
    }
    const filterLower = filter?.toLowerCase();

    const filterJob = (job) => {
      if (!filter) {
        return true;
      }
      return false ||
        matches(job, "id") ||
        matches(job, "patientFirstName") ||
        matches(job, "patientLastName") ||
        matches(job, "patientEmail") ||
        matches(job, "doctorName") ||
        matches(job, "doctorEmail") ||
        matches(job, "medicines")
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
    
    return sortedJobs.
      filter(job => filterJob(job))
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
    <>
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
          hideChildrenUpToBreakpoint="sm" // for mobile, hide text children
          sx={{
            mt: theme.spacing(0.3),
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
                  {t("Id")} {sortButton({ column: "id" })}
                </TableCell>
                <TableCell onClick={handleSort("patientLastName")}>
                  {t("patient last name")} {sortButton({ column: "patientLastName" })}
                </TableCell>
                <TableCell onClick={handleSort("patientFirststName")}>
                  {t("patient first name")} {sortButton({ column: "patientFirstName" })}
                </TableCell>
                <TableCell>
                  {t("Actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getSortedFilteredPaginatedJobs(/*jobs, sortColumn, sortDirection*/).map(job => {
                  const isItemSelected = isSelected(job.id);
                  //console.log("ID:", job.id);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, job.id)}
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
                      <TableCell>{job.id}</TableCell>
                      <TableCell>{job.patient?.firstName}</TableCell>
                      <TableCell>{job.patient?.lastName}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => onEdit(job.id)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => showDialog({
                          onConfirm: () => removeJob(job.id),
                          title: t("Confirm Delete"),
                          message: t("Are you sure you want to delete {{count}} selected job?", { count: 1 }),
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
          count={jobs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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

    </>
  );
};

export default React.memo(JobsTable);
