import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
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
//import { blue, grey } from "@mui/material/colors";
//import { JobContext } from "../providers/JobContext";
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
  //const { jobs, jobsError } = useContext(JobContext); // JobContext gives us only logged user's jobs, don't use it here
  const [ jobs, setJobs ] = useState([]);
  const { auth } = useContext(AuthContext);
  const { isMobile, xs, sm, md } = useMediaQueryContext();
  const [filter, setFilter] = useState("");
  //const [, setRequests] = useState(null);
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
      console.log("Swiped left!");
    },
    onSwipedRight: () => {
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth();
      (view === "month" ? setActivePrevMonthDate(month, year) : setActivePrevYearDate(year));
      console.log("Swiped right!");
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // allows desktop drag gestures too
  });
  const allUsersRequests = isAdmin(auth.user);  // if admin, get all jobs, otherwise only the user's

  // Safe date add
  const addDays = (dateString, days) => {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + days));
    return date.toISOString().split("T")[0];
  };

  // Build scheduled map
  const requestsScheduled = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      uniqueUsers.add(job.userId);
      uniquePatients.add(job.patient.email);
      uniqueDoctors.add(job.doctor.email);
      job.medicines.forEach((medicine) => {
        uniqueMedicines.add(medicine.id); // or medicine.name if it's an object

        // TODO: handle job.isActive: ignore not active jobs ? probably yes
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
        console.log("°°° schedule.medicine.fieldSinceDate:", schedule.medicine.fieldSinceDate);
        if (typeof schedule.medicine.fieldSinceDate === Date) {
          alert(medicine.name + " has fieldSinceDate as Date, not ISO STRING! Why???");
          return;
        }
        let dateKey = schedule.medicine.fieldSinceDate.split("T")[0]; // TODO: this can be "2025-10-29T18:18:42.422Z" or "Thu Oct 30 2025 20:15:38 GMT+0100 (Central European Standard Time)"; in the second case, we get error: "r.medicine.fieldSinceDate.split is not a function" because fieldSinceDate is a Date... Why sometimes we get a Date???
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
  }, [jobs, uniqueUsers, uniquePatients, uniqueDoctors, uniqueMedicines]);

  const handleFilterChange = (e) => setFilter(e.target.value); // TODO: implement filtering

  /*
  // Error handling
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
  */
  
  // Get jobs
  useEffect(() => {
    (async () => {
      const options = {
        decryptJobs: true,
        ...(allUsersRequests ? {userId: "*"} : { userId: auth.user.id }), // if admin, get all users, to get all jobs
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
        // TODO: filter out inactive jobs
      }
    })();
  }, [auth.user, setJobs, allUsersRequests, showSnackbar]);

  /*
  // Get requests
  useEffect(() => {
    (async () => {
      const result = await apiCall(
        "get",
        "/request/getRequests",
        allUsersRequests ? {} : { userId: auth.user.id } // if admin, get all requests
      );
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
        for (const request of result.requests) {
          [request.lastStatus, request.lastStatusDate, request.lastReason] =
            getHighestStatus(request.events);
        }
        setRequests(result.requests);
      }
    })();
  }, [auth.user, allUsersRequests, showSnackbar]);
*/
  
  /**
   * WebHooks do not necessarily arrive in order, so on server we store all events, and
   * consider the 'last' status the one with the highest priority, not the last arrived.
   */
  /*
  const getHighestStatus = (events) => {
    if (!events || events.length === 0) return [null, null, null];
    const statuses = {
      request: 1,
      delivered: 2,
      hard_bounce: 3,
      soft_bounce: 4,
      invalid_email: 5,
      blocked: 6,
      spam: 7,
      unsubscribed: 8,
      error: 9,
      deferred: 10,
      unforeseen: 99,
      click: 101,
      opened: 102,
    };
    return events.reduce((best, current) => {
      const [bestStatus, bestAt] = best;
      const bestRank = bestStatus ? statuses[bestStatus] : -1;
      const currentRank = statuses[current.status];
      if (
        currentRank > bestRank ||
        (currentRank === bestRank && new Date(current.at) > new Date(bestAt))
      ) {
        return [current.status, current.at, current.reason];
      }
      return best;
    }, [null, null]);
  };
  */

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
    //const year = activeStartDate.getFullYear();
    //const month = activeStartDate.getMonth(); // 0-based
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

  // Calendar Header
  const renderCalendarHeader = ({ month, year /*title, onPrev, onNext, onTitleClick*/ }) => {
    const firstDay = new Date(year, month ?? 0, 1);

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
              firstDay.toLocaleString(i18n.language, { month: "long", year: "numeric" })
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

  const renderCalendarCellContents = ({ mode, year, month, day }) => { // TODO ...
    if (!day) return null; // cell is an empty cell
    if (!requestsScheduled) return null; // not yet loaded, or no requests
    if (uniqueUsers.size === 0) return null; // not yet loaded, or no requests
    const dateKey = `${year}-${String(1 + month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const rs = requestsScheduled[dateKey];
    if (!rs) return null; // no requests for this day
    if (!rs.length) return null; // no requests for this day

    // TODO: unify colors and numbers in one object, not two parallel arrays...
    // TODO: simplify view for mobile
    const colors = [
      "#e74c3c",
      "#3498db",
      "#f1c40f",
      "#2ecc71"
    ]; // red, blue, yellow, green
    const numbers = [
      rs.reduce((set, r) => set.add(`${r.userFirstName} ${r.userLastName}`), new Set()).size,
      rs.reduce((set, r) => set.add(`${r.patient.firstName} ${r.patient.lastName}`), new Set()).size,
      rs.reduce((set, r) => set.add(r.doctor.name), new Set()).size,
      rs.reduce((set, r) => set.add(r.medicine.id), new Set()).size,
    ];

    if (mode === "yearly") { // TODO: use a better solution yo show at least medicines count in yearly view (a bar)
      return numbers[3];
    }

    return (
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {colors.map((color, i) => {
          if (i < 3 && numbers[i] <= 1) return;
          return (
            <Tooltip key={i} title={
              i === 0 ? t("{{count}} users", { count: numbers[i] }) :
                i === 1 ? t("{{count}} patients", { count: numbers[i] }) :
                  i === 2 ? t("{{count}} doctors", { count: numbers[i] }) :
                    t("{{count}} medicines", { count: numbers[i] })}
            >
              <Box
                key={i}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {numbers[i]}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    );
  }

  // Get an array of day cells for a given month, including nulls
  const getDayCells = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDay.getDay();
    const dayCells = Array(startDayOfWeek).fill(null);
    for (let d = 1; d <= daysInMonth; d++) dayCells.push(d);
    return dayCells;
  };

  // Compute day state (today, past)
  const getDateState = (year, month, day) => {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const date = new Date(year, month, day);
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    const isPast = date < todayMidnight;
    return { isToday, isPast };
  };

  /**
   * Reusable Calendar Day Cell
   */
  const CalendarDayCell = ({
    year,
    month,
    day,
    mode, // "monthly" | "yearly"
    theme,
    hasRequest,
    onClick,
    renderCellContents,
  }) => {
    // Default opacity for empty / past days
    let opacity = 1.0;
    let isToday = false;
    let isPast = false;

    if (!day) {
      opacity = 0.2;
    } else {
      const state = getDateState(year, month, day);
      isToday = state.isToday;
      isPast = state.isPast;
      if (isPast) opacity = 0.6;
    }

    return (
      <Box
        onClick={() => day && onClick({ day, month, year })}
        sx={{
          position: mode === "monthly" ? "relative" : "static",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          opacity,
          borderRadius: 1,
          fontSize: theme.typography.caption.fontSize,

          // Month view has fixed height, year view uses aspect ratio
          ...(mode === "monthly"
            ? {
                [theme.breakpoints.only("xs")]: { aspectRatio: "1" },
                [theme.breakpoints.up("sm")]: { height: 96 },
              }
            : {
                aspectRatio: "1",
              }),

          // Background colors depending on state
          bgcolor: hasRequest
            ? isToday
              ? darken(theme.palette.info.light, 0.1)
              : theme.palette.secondary.main
            : isToday
            ? darken(theme.palette.info.light, 0)
            : theme.palette.action.selected,

          "&:hover": {
            bgcolor: hasRequest
              ? isToday
                ? darken(theme.palette.info.light, 0.3)
                : darken(theme.palette.primary.main, 0.1)
              : isToday
              ? darken(theme.palette.info.light, 0.2)
              : darken(theme.palette.action.selected, 0.1),
          },
        }}
      >
        {/* Day number */}
        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          lineHeight={2}
        >
          {day ?? null}
        </Typography>

        {/* Content rendering differs for monthly vs yearly */}
        {day && (
          <Typography
            variant="caption"
            sx={
              mode === "monthly"
                ? {
                    position: "absolute",
                    bottom: 4,
                    left: 4,
                  }
                : {
                    display: "block",
                    textAlign: "left",
                    lineHeight: 1,
                    fontSize: "0.6em",
                    pl: 3.0,
                    pt: 0.9,
                  }
            }
          >
            {renderCellContents({ mode, year, month, day })}
          </Typography>
        )}
      </Box>
    );
  };

  /**
   * Calendar Month View
   */
  const renderCalendarMonthView = ({
    activeStartDate,
    theme,
    requestsScheduled,
    t,
    renderCalendarHeader,
    renderCalendarCellContents,
    handleClick,
  }) => {
    const year = activeStartDate.getFullYear();
    const month = activeStartDate.getMonth();
    const weekDays = [
      t("Su"),
      t("Mo"),
      t("Tu"),
      t("We"),
      t("Th"),
      t("Fr"),
      t("Sa"),
    ];
    const dayCells = getDayCells(year, month);

    return (
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {renderCalendarHeader({ month, year })}

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
                : `${year}-${String(month + 1).padStart(2, "0")}-${String(
                    day
                  ).padStart(2, "0")}`;
            const hasRequest = dateKey && requestsScheduled[dateKey];
            return (
              <CalendarDayCell
                key={idx}
                year={year}
                month={month}
                day={day}
                mode="monthly"
                theme={theme}
                hasRequest={hasRequest}
                onClick={handleClick}
                renderCellContents={renderCalendarCellContents}
              />
            );
          })}
        </Box>
      </Box>
    );
  };

  /**
   * Calendar Year View
   */
  const renderCalendarYearView = ({
    activeStartDate,
    isMobile,
    theme,
    requestsScheduled,
    i18n,
    renderCalendarHeader,
    renderCalendarCellContents,
    handleClick,
    scrollContainerRef,
    scrollMonthRefs,
  }) => {
    const year = activeStartDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);
    const columns = !isMobile ? 4 : 1;

    return (
      <Box
        sx={{
          borderRadius: 2,
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {renderCalendarHeader({ month: 0, year })}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 1.5,
          }}
        >
          {months.map((month, idx) => {
            const firstDay = new Date(year, month, 1);
            const dayCells = getDayCells(year, month);

            return (
              <div key={idx} ref={scrollContainerRef}>
                <Box
                  ref={(el) => (scrollMonthRefs.current[idx] = el)}
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
                    {firstDay.toLocaleString(i18n.language, { month: "short" })}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 0.2,
                    }}
                  >
                    {dayCells.map((day, dIdx) => {
                      const dateKey =
                        day === null
                          ? null
                          : `${year}-${String(month + 1).padStart(
                              2,
                              "0"
                            )}-${String(day).padStart(2, "0")}`;
                      const hasRequest = dateKey && requestsScheduled[dateKey];

                      return (
                        <CalendarDayCell
                          key={dIdx}
                          year={year}
                          month={month}
                          day={day}
                          mode="yearly"
                          theme={theme}
                          hasRequest={hasRequest}
                          onClick={handleClick}
                          renderCellContents={renderCalendarCellContents}
                        />
                      );
                    })}
                  </Box>
                </Box>
              </div>
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

      {/* --- Responsive layout --- */}
      <Grid container spacing={1} alignItems="center" justifyContent="flex-end">
        {/* --- Search input --- */}
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

        {/* --- Month/Year buttons and selector --- */}
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
            {/* {view === "year" && renderYearSelector()} */}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        {/* {view === "month" ? renderCalendarMonthView() : renderCalendarYearView()} */}
        {view === "month" ?
          renderCalendarMonthView({
            activeStartDate,
            theme,
            requestsScheduled,
            t,
            renderCalendarHeader,
            renderCalendarCellContents,
            handleClick,
          })
        :
          renderCalendarYearView({
            activeStartDate,
            isMobile,
            theme,
            requestsScheduled,
            i18n,
            renderCalendarHeader,
            renderCalendarCellContents,
            handleClick,
            scrollContainerRef,
            scrollMonthRefs,
          })
        }
      </Box>

    </Container>
  );
};

export default React.memo(RequestsScheduledCalendar);
