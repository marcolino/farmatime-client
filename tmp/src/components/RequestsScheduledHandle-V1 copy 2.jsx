import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { darken } from "@mui/material";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Tooltip,
} from "mui-material-custom";
import { TextFieldSearch, RequestScheduledDetails } from "./custom";
import { SectionHeader1 } from "mui-material-custom";
import { Search, ScheduleSend, NavigateBefore, NavigateNext} from "@mui/icons-material";
import { apiCall } from "../libs/Network";
import { isAdmin } from "../libs/Validation";
import { formatDateDDMMMYYYY, formatDateMMMMYYYY } from '../libs/Misc';
import { AuthContext } from "../providers/AuthContext";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useSnackbarContext } from "../hooks/useSnackbarContext";
import { useDialog } from "../providers/DialogContext";
import config from "../config";


const RequestsScheduledCalendar = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { showSnackbar } = useSnackbarContext();
  const [jobs, setJobs] = useState([]);
  const { auth } = useContext(AuthContext);
  const { isMobile, xs, sm, md } = useMediaQueryContext();
  const [filter, setFilter] = useState("");
  const [view, setView] = useState("month"); // 'month' or 'year'
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const { showDialog } = useDialog();
  const uniqueUsers = useMemo(() => new Set(), []);
  const uniquePatients = useMemo(() => new Set(), []);
  const uniqueDoctors = useMemo(() => new Set(), []);
  const uniqueMedicines = useMemo(() => new Set(), []);
  const scrollContainerRef = useRef(null);
  const scrollMonthRefs = useRef([]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth();
      (view === "month" ? setActiveNextMonthDate(month, year) : setActiveNextYearDate(year));
      // console.log("Swiped left!");
    },
    onSwipedRight: () => {
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth();
      (view === "month" ? setActivePrevMonthDate(month, year) : setActivePrevYearDate(year));
      // console.log("Swiped right!");
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // allows desktop drag gestures too
  });
  const allUsersRequests = isAdmin(auth.user); // if admin, get all jobs, otherwise only the user's

  // Safe date add
  const addDays = (dateString, days) => {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + days));
    return date.toISOString().split("T")[0];
  };

  // Filter jobs
  const getFilteredJobs = useCallback(jobs => {
    if (!filter) {
      return jobs;
    }
    const filterLower = filter?.toLowerCase();
    const matches = (obj, fieldName) => {
      if (Array.isArray(obj)) { // obj is array
        // Return true if SOME object in the array matches the condition
        return obj.some(item => checkFieldValue(item, fieldName, filterLower));
      } else { // obj is Object
        return checkFieldValue(obj, fieldName, filterLower);
      }
        
      function checkFieldValue(item, fieldName, filterLower) {
        let fieldValue = item[fieldName];
        if (!item) {
          return false;
        }
        if (!item[fieldName]) {
          return false;
        }
        return fieldValue.toString().toLowerCase().includes(filterLower);
      };
    };

    return jobs.filter(job =>
      matches(job, "userFirstName") ||
      matches(job, "userLastName") ||
      matches(job.doctor, "name") ||
      matches(job.doctor, "email") ||
      matches(job.patient, "firstName") ||
      matches(job.patient, "lastName") ||
      matches(job.patient, "email") ||
      matches(job.medicines, "name")
    );
  }, [filter]);

  // Build scheduled map
  const requestsScheduled = useMemo(() => {
    const map = {};
    getFilteredJobs(jobs).forEach((job) => {
      uniqueUsers.add(job.userId);
      uniquePatients.add(job.patient.email);
      uniqueDoctors.add(job.doctor.email);
      job.medicines.forEach((medicine) => {
        uniqueMedicines.add(medicine.id); // or medicine.name if it's an object

        if (!job.isActive) return; // ignore not active jobs - TODO: do this filter on server?

        const schedule = {
          userFirstName: job.userFirstName,
          userLastName: job.userLastName,
          jobId: job.id,
          patient: job.patient,
          doctor: job.doctor,
          isActive: job.isActive,
          timestampCreation: job.timestampCreation,
          timestampLastModification: job.timestampLastModification,
          medicine,
        };
        let dateKey = schedule.medicine.fieldSinceDate.split("T")[0];

        // Loop until maximum year end
        const endDate = new Date(config.ui.jobs.requestsScheduled.maximumYear + "-" + "12" + "-" + "31");
        while (new Date(dateKey) <= endDate) {
          const scheduleCopy = { ...schedule, dateKey };
          map[dateKey] = map[dateKey] || [];
          map[dateKey].push(scheduleCopy);
          dateKey = addDays(dateKey, schedule.medicine.fieldFrequency);
        }
      });
    });
    return map;
  }, [jobs, getFilteredJobs, uniqueUsers, uniquePatients, uniqueDoctors, uniqueMedicines]);

  const handleFilterChange = (e) => setFilter(e.target.value);
  
  // Get jobs
  useEffect(() => {
    (async () => {
      const options = {
        decryptJobs: true,
        ...(allUsersRequests ? { userId: "*" } : { userId: auth.user.id }), // if admin, get all users, to get all jobs
      };
      const result = await apiCall(
        "get",
        "/user/getUsersJobs",
        options
      );
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        setJobs(result.jobs);
      }
    })();
  }, [auth.user, setJobs, allUsersRequests, showSnackbar]);

  // check if we have to scroll to current month
  useEffect(() => {
    const month = activeStartDate.getMonth(); // 0-based
    if (view === "year" && scrollContainerRef.current && scrollMonthRefs.current[month]) {
      // Smooth scroll to the current month
      scrollMonthRefs.current[month].scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [view, activeStartDate]);

  // Handle clicks on a calendar day or month
  const handleClick = ({ day, month, year }) => {
    let period = "", dateKey = "", title = "", requestsScheduledOnPeriod = [];
    if (day) { // show requests for this day only
      period = "daily";
      dateKey = `${year}-${String(1 + month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      title = t("Requests on day {{date}}", { date: formatDateDDMMMYYYY(dateKey) });
      requestsScheduledOnPeriod = requestsScheduled[dateKey] ?? [];
    } else { // show requests for the whole month
      if (month) {
        period = "monthly";
        title = t("Requests on month {{date}}", { date: formatDateMMMMYYYY(`${year}-${1 + month}-01`) });
        const daysInMonth = new Date(year, 1 + month, 0).getDate();
        for (day = 1; day <= daysInMonth; day++) {
          dateKey = `${year}-${String(1 + month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          if (requestsScheduled[dateKey]) {
            requestsScheduledOnPeriod.push(...requestsScheduled[dateKey]);
          }
        }
        day = 1; // reset day
      } else {
        period = "yearly";
        const monthsInYear = 12;
        title = t("Requests on year {{date}}", { date: year });
        for (month = 0; month < monthsInYear; month++) {
          const daysInMonth = new Date(year, 1 + month, 0).getDate();
          for (day = 1; day <= daysInMonth; day++) {
            dateKey = `${year}-${String(1 + month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            if (requestsScheduled[dateKey]) {
              requestsScheduledOnPeriod.push(...requestsScheduled[dateKey]);
            }
          }
        }
      }
    }
    const message = <RequestScheduledDetails items={requestsScheduledOnPeriod.map((item) => ({
      dateKey: item.dateKey,
      user: `${item.userFirstName} ${item.userLastName}`,
      patient: `${item.patient.firstName} ${item.patient.lastName}`,
      doctor: item.doctor.name,
      medicine: item.medicine,
    }))} period={period} allUsersRequests={allUsersRequests} />;
    showDialog({ title, message, confirmText: t("Close") });
  }

  // Date navigation with limits
  const setActivePrevMonthDate = (month, year) => { // month is 0-based
    if (1 + month === 1 && year <= config.ui.jobs.requestsScheduled.minimumYear) { // Prevent going before minimum year
      showSnackbar(t("Cannot go before year {{year}}", { year: config.ui.jobs.requestsScheduled.minimumYear }), "warning");
      return;
    }
    setActiveStartDate(new Date(year, month - 1, 1));
  };

  const setActiveNextMonthDate = (month, year) => { // month is 0-based
    if (1 + month === 12 && year >= config.ui.jobs.requestsScheduled.maximumYear) { // Prevent going after maximum year
      showSnackbar(t("Cannot go after year {{year}}", { year: config.ui.jobs.requestsScheduled.maximumYear }), "warning");
      return;
    }
    setActiveStartDate(new Date(year, 1 + month, 1));
  };

  const setActivePrevYearDate = (year) => {
    if (year <= config.ui.jobs.requestsScheduled.minimumYear) { // Prevent going before minimum year
      showSnackbar(t("Cannot go before year {{year}}", { year: config.ui.jobs.requestsScheduled.minimumYear }), "warning");
      return;
    }
    setActiveStartDate(new Date(year - 1, 1));
  };

  const setActiveNextYearDate = (year) => {
    if (year >= config.ui.jobs.requestsScheduled.maximumYear) { // Prevent going after maximum year
      showSnackbar(t("Cannot go after year {{year}}", { year: config.ui.jobs.requestsScheduled.maximumYear }), "warning");
      return;
    }
    setActiveStartDate(new Date(year + 1, 1));
  };

  // First day of the year (or month, if passed)
  const firstDay = (year, month = 0) => {
    return new Date(year, month, 1);
  };

  // Calendar Header
  const renderCalendarHeader = ({ year, month /*title, onPrev, onNext, onTitleClick*/ }) => {
    //const firstDay = new Date(year, month ?? 0, 1);

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
          gap: 1,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {/* Previous month/year button */}
        <Button
          size="small"
          variant={"contained"}
          onClick={() => (view === "month") ? setActivePrevMonthDate(month, year) : setActivePrevYearDate(year)}
          sx={{
            minWidth: { xs: 'auto', sm: 64 },
            mx: 0,
            px: 1,
          }}
        >
          <NavigateBefore />
        </Button>

        {/* Month/year name */}
        <Typography variant="subtitle1"
          onClick={() => handleClick({ day: null, month: (view === "month") ? month : null, year })}
          sx={{
            fontWeight: 500,
            textAlign: "center",
            minWidth: (view === "month") ? { xs: 150, sm: 200 } : { xs: 64, sm: 92 },
            cursor: "pointer",
          }}
        >
          {
            (view === "month") ?
              firstDay(year, month).toLocaleString(i18n.language, { month: "long", year: "numeric" })
            :
              year
          }
        </Typography>

        {/* Next month/year button */}
        <Button
          size="small"
          variant={"contained"}
          onClick={() => (view === "month") ? setActiveNextMonthDate(month, year) : setActiveNextYearDate(year)}
          sx={{
            minWidth: { xs: 'auto', sm: 64 },
            mx: 0,
            px: 1,
          }}
        >
          <NavigateNext />
        </Button>
      </Box>
    )
  };

  const renderCalendarCellContents = ({ mode, year, month, day }) => {
    if (!day) return null; // cell is an empty cell
    if (!requestsScheduled) return null; // not yet loaded, or no requests
    if (uniqueUsers.size === 0) return null; // not yet loaded, or no requests
    const dateKey = `${year}-${String(1 + month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const rs = requestsScheduled[dateKey];
    if (!rs) return null; // no requests for this day
    if (!rs.length) return null; // no requests for this day

    const data = [
      { color: "#e74c3c", value: rs.reduce((set, r) => set.add(`${r.userFirstName} ${r.userLastName}`), new Set()).size }, // users
      { color: "#3498db", value: rs.reduce((set, r) => set.add(`${r.patient.firstName} ${r.patient.lastName}`), new Set()).size }, // patients
      { color: "#f1c40f", value: rs.reduce((set, r) => set.add(r.doctor.name), new Set()).size }, // doctors
      { color: "#2ecc71", value: rs.reduce((set, r) => set.add(r.medicine.id), new Set()).size }, // medicines
    ];

    if (mode === "yearly") { // TODO: use a better solution to show at least medicines count in yearly view (a bar?)
      return (
        <Typography
          variant="caption"
          display="block"
          textAlign="left"
          lineHeight={1}
          fontSize={"0.6em"}
          pl={3.0}
          pt={0.9}
        >
          {data[3].value /* Medicines value only */}
        </Typography>
      );
    } else {
      return (
        <Typography
          variant="caption"
          textAlign="left"
          sx={{
            position: "absolute",
            bottom: isMobile ? 2 : 4, // small padding from bottom
            left: isMobile ? 2 : 4, // small padding from left
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "2px" : "6px",
            }}
          >
            {data.map((item, i) => {
              const color = item.color;
              const value = data[i].value;
              if (i < 3 && value <= 1) return; // do not show users, patients and doctors if none or just one
              return (
                <Tooltip
                  key={i}
                  title={
                    i === 0 ? t("{{count}} users", { count: value }) :
                      i === 1 ? t("{{count}} patients", { count: value }) :
                        i === 2 ? t("{{count}} doctors", { count: value }) :
                          t("{{count}} medicines", { count: value })
                  }
                >
                  <span>{/* Tooltip children must support ref, and Box does not, while span does */}
                    <Box
                      style={{
                        width: isMobile ? "12px" : "24px",
                        height: isMobile ? "12px" : "24px",
                        fontSize: isMobile ? "8px" : "14px",
                        borderRadius: "50%",
                        backgroundColor: color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {value}
                    </Box>
                  </span>
                </Tooltip>
              );
            })}
          </Box>
        </Typography>
      );
    }
  }

  // Helper to generate day cells for a month
  const getDayCells = (year, month) => {
    //const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayCells = [];

    for (let i = 0; i < firstDay(year, month).getDay(); i++) dayCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) dayCells.push(d);

    return dayCells;
  };

  // Calendar Month View
  const renderCalendarMonthView = () => {
    const year = activeStartDate.getFullYear();
    const month = activeStartDate.getMonth(); // 0-based
    const dayCells = getDayCells(year, month);
    const weekDays = [t("Su"), t("Mo"), t("Tu"), t("We"), t("Th"), t("Fr"), t("Sa")];

    return (
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {renderCalendarHeader({ year, month: month ?? 0})}
        
        {/* Weekday header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            textAlign: "center",
            fontWeight: 500,
            mb: 0.5,
            fontSize: theme.typography.caption.fontSize,
          }}
        >
          {weekDays.map((wd) => (
            <Box key={wd}>{wd}</Box>
          ))}
        </Box>

        {/* Month grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 0.4,
            [theme.breakpoints.down("sm")]: { gap: 0.3 },
          }}
        >
          {dayCells.map((day, idx) => {
            const dateKey =
              day === null
                ? null
                : `${year}-${String(1 + month).padStart(2, "0")}-${String(day).padStart(
                    2,
                    "0"
                  )}`;
            const hasRequest = dateKey && requestsScheduled[dateKey];

            // Evaluate the date: past/today/future
            let opacity = 1.0;
            let isToday, isPast; //, isFuture = false;
            if (!day) {
              opacity = 0.2;
            } else {
              const date = new Date(year, month, day);
              const today = new Date();

              // normalize today to local midnight
              const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

              isToday =
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate();
              isPast = date < todayMidnight;
              if (isPast) opacity = 0.6;
            }

            return (
              <div key={idx}>{/* For the moment we disable tooltip for month view
                <Tooltip key={idx} title={tooltipTextDay(day, month, year)} arrow>
              */}
                <Box
                  //key={idx}
                  onClick={() => day ? handleClick({ day, month, year }) : null}
                  sx={{
                    position: "relative", // enable absolute positioning for the bottom text
                    display: "flex",
                    justifyContent: "center", // center day number horizontally
                    //justifyContent: "flex-start", // align horizontally to the left
                    alignItems: "flex-start", // align vertically to the top
                    //flexDirection: "column", // stack content top-down if multiple children
                    // Applies only to xs screens
                    [theme.breakpoints.only('xs')]: {
                      aspectRatio: "1"
                    },
                    // Applies to sm and up
                    [theme.breakpoints.up('sm')]: {
                      height: 96,
                    },
                    // border,
                    opacity,
                    borderRadius: 1,
                    fontSize: theme.typography.caption.fontSize,
                    bgcolor: hasRequest
                      ? (isToday ? darken(theme.palette.info.light, .1) : theme.palette.secondary.main)
                      : (isToday ? darken(theme.palette.info.light, .0) : theme.palette.action.selected),
                    "&:hover": {
                      bgcolor: hasRequest
                        ? (isToday ? darken(theme.palette.info.light, .3) : darken(theme.palette.primary.main, .1))
                        : (isToday ? darken(theme.palette.info.light, .2) : darken(theme.palette.action.selected, .1)),
                    },
                  }}
                >
                  {/* <Typography
                    variant="caption"
                    display="block"
                    textAlign="center"
                    lineHeight={2}
                  >
                    {day ?? null}
                  </Typography> */}
                  <Typography
                    variant="caption"
                    display="block"
                    textAlign="center"
                    lineHeight={2}
                    pl={0.5}
                    pt={0.1}
                  >
                    {day ?? null}
                  </Typography>
                  {renderCalendarCellContents({ mode: "monthly", year, month, day })}
                </Box>
              {/*
              </Tooltip>
              */}</div>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Calendar Year View
  const renderCalendarYearView = () => {
    const year = activeStartDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);

    const columns = isMobile ? 1 : 4;
      
    return (
      <Box sx={{ borderRadius: 2, p: 2, border: `1px solid ${theme.palette.divider}` }}>

        {renderCalendarHeader({ year, month: 0 })}
        
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 1.5,
          }}
        >
          {months.map((month, idx) => {
            const dayCells = getDayCells(year, month);

            return (
              <div
                key={idx}
                ref={scrollContainerRef}
              >
              {/* For the moment we disable tooltip for year view
                <Tooltip key={month} title={tooltipTextMonth(month, year)} arrow>
                ref={containerRef}
              */}
                <Box
                  //key={month}
                  ref={el => (scrollMonthRefs.current[idx] = el)} // To enable scrolling
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 1,
                    fontFamily: theme.typography.fontFamily,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    textAlign="center"
                    sx={{ mb: 0.5, fontWeight: 600 }}
                    onClick={() => handleClick({ day: null, month, year })}
                  >
                    {firstDay(year, month).toLocaleString(i18n.language, { month: "short" })}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 0.2,
                    }}
                  >
                    {dayCells.map((day, idx) => {
                      
                      const dateKey =
                        day === null
                          ? null
                          : `${year}-${String(1 + month).padStart(2, "0")}-${String(
                              day
                          ).padStart(2, "0")}`;
                      const hasRequest = dateKey && requestsScheduled[dateKey];
                      
                      let opacity = 1.0;
                      let isToday, isPast = false; // isFuture = false;
                      if (!day) {
                        opacity = 0.2;
                      } else {
                        const date = new Date(year, month, day);
                        const today = new Date();

                        // normalize today to local midnight
                        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        
                        isToday =
                          date.getFullYear() === today.getFullYear() &&
                          date.getMonth() === today.getMonth() &&
                          date.getDate() === today.getDate();
                        isPast = date < todayMidnight;
                        if (isPast) opacity = 0.6;
                      }

                      return (
                        <Box
                          key={idx}
                          onClick={() => dateKey ? handleClick({ day, month, year }) : null}
                          sx={{
                            display: "flex", // make it a flex container
                            justifyContent: "flex-start", // align items to the top
                            alignItems: "center", // center horizontally
                            flexDirection: "column", // stack children vertically
                            aspectRatio: "1",
                            opacity,
                            borderRadius: 0.5,
                            bgcolor: hasRequest
                              ? (isToday ? darken(theme.palette.info.light, .1) : theme.palette.secondary.main)
                              : (isToday ? darken(theme.palette.info.light, .0) : theme.palette.action.selected),
                            "&:hover": {
                              bgcolor: hasRequest
                                ? (isToday ? darken(theme.palette.info.light, .3) : darken(theme.palette.primary.main, .1))
                                : (isToday ? darken(theme.palette.info.light, .2) : darken(theme.palette.action.selected, .1)),
                            },
                          }}
                        >
                          <Typography
                            variant="caption"
                            display="block"
                            lineHeight={1}
                            pl={0.3}
                            pt={0.3}
                          >
                            {day ?? null}
                          </Typography>
                          {renderCalendarCellContents({ mode: "yearly", year, month, day })}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              {/*
              </Tooltip>
              */}</div>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Container {...handlers} maxWidth="lg" sx={{ py: xs ? 2 : 4, userSelect: "none" }}>
      <SectionHeader1>
        <ScheduleSend fontSize="large" /> {xs ? t("Future Req.s") : t("Future Requests")}
      </SectionHeader1>

      {/* Responsive layout */}
      <Grid container spacing={1} alignItems="center" justifyContent="flex-end">
        {/* Search input */}
        <Grid grid={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }} sx={{ textAlign: "right" }}>
          <TextFieldSearch
            label={t("Search")}
            value={filter}
            size="small"
            margin="dense"
            onChange={handleFilterChange}
            startIcon={<Search />}
            fullWidth={xs || sm || md ? false : true}
            sx={{ color: theme.palette.text.primary }}
          />
        </Grid>

        {/* Month/Year buttons */}
        <Grid grid={{xs: 12, sm: 12, md: 12, lg: 6, xl: 6}} sx={{ textAlign: "right" }}>
          <Box sx={{ display: "inline-flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant={view === "month" ? "contained" : "outlined"}
              onClick={() => setView("month")}
            >
              {t("Month")}
            </Button>
            <Button
              variant={view === "year" ? "contained" : "outlined"}
              onClick={() => setView("year")}
            >
              {t("Year")}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>{view === "month" ? renderCalendarMonthView() : renderCalendarYearView()}</Box>

    </Container>
  );
};

export default React.memo(RequestsScheduledCalendar);
