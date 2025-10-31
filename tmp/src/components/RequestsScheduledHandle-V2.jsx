import React, { useState, useEffect, useContext, useMemo } from "react";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  //Tooltip,
} from "mui-material-custom";
import { TextFieldSearch, RequestScheduledDetails } from "./custom";
import { SectionHeader1 } from "mui-material-custom";
import { Search, ScheduleSend, NavigateBefore, NavigateNext } from "@mui/icons-material";
import { JobContext } from "../providers/JobContext";
import { apiCall } from "../libs/Network";
import { isAdmin } from "../libs/Validation";
import { formatDateDDMMMYYYY, formatDateMMMMYYYY } from '../libs/Misc';
import { AuthContext } from "../providers/AuthContext";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useSnackbarContext } from "../hooks/useSnackbarContext";
import { useDialog } from "../providers/DialogContext";
import config from "../config";


// --- Shared small components ---
const CalendarHeader = ({ title, onPrev, onNext, onTitleClick, width, theme }) => (
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
    {/* Previous button */}
    <Button
      size="small"
      variant={"contained"}
      onClick={onPrev}
      sx={{
        minWidth: { xs: 'auto', sm: 64 },
        mx: 0,
        px: 1,
      }}
    >
      <NavigateBefore />
    </Button>

    {/* Title */}
    <Typography
      variant="subtitle1"
      onClick={onTitleClick}
      sx={{
        fontWeight: 500,
        textAlign: "center",
        width: width ?? { xs: 64, sm: 92 },
        cursor: "pointer",
      }}
    >
      {title}
    </Typography>

    {/* Next button */}
    <Button
      size="small"
      variant={"contained"}
      onClick={onNext}
      sx={{
        minWidth: { xs: 'auto', sm: 64 },
        mx: 0,
        px: 1,
      }}
    >
      <NavigateNext />
    </Button>
  </Box>
);

const DayCell = ({ dateKey, hasRequest, onClick, theme, isMobile, children }) => (
  <Box
    onClick={onClick}
    sx={{
      [theme.breakpoints.only('xs')]: {
        aspectRatio: "1"
      },
      [theme.breakpoints.up('sm')]: {
        display: "flex",
        height: 96,
        justifyContent: "center"
      },
      borderRadius: 1,
      fontSize: theme.typography.caption.fontSize,
      bgcolor: hasRequest
        ? theme.palette.primary.light
        : theme.palette.action.hover,
      "&:hover": {
        bgcolor: hasRequest
          ? theme.palette.primary.main
          : theme.palette.action.selected,
      },
    }}
  >
    {children}
  </Box>
);


const RequestsScheduledCalendar = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { showSnackbar } = useSnackbarContext();
  const { jobs, jobsError } = useContext(JobContext);
  const { auth } = useContext(AuthContext);
  const { isMobile, xs, sm, md } = useMediaQueryContext();
  const [filter, setFilter] = useState("");
  const [, setRequests] = useState(null);
  const [view, setView] = useState("month"); // 'month' or 'year'
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const { showDialog } = useDialog();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth();
      setActiveNextMonthDate(month, year);
      console.log("Swiped left!");
    },
    onSwipedRight: () => {
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth();
      setActivePrevMonthDate(month, year);
      console.log("Swiped right!");
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // allows desktop drag gestures too
  });
  //const allUsersRequests = isAdmin(auth.user) ? {} : { userId: auth.user.id };
  const allUsersRequests = isAdmin(auth.user);  // if admin, get all requests, otherwise only the user's

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
      job.medicines.forEach((medicine) => {
        const schedule = {
          jobId: job.id,
          patient: job.patient,
          doctor: job.doctor,
          isActive: job.isActive,
          timestampCreation: job.timestampCreation,
          timestampLastModification: job.timestampLastModification,
          medicine,
        };
        console.log("°°° schedule.medicine.fieldSinceDate:", schedule.medicine.fieldSinceDate);
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
  }, [jobs]);

  const handleFilterChange = (e) => setFilter(e.target.value); // TODO: implement filtering

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

  /**
   * WebHooks do not necessarily arrive in order, so on server we store all events, and
   * consider the 'last' status the one with the highest priority, not the last arrived.
   */
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
      user: `${auth.user.firstName} ${auth.user.lastName}`,
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

  // Custom Year View
  const renderYearView = () => {
    const year = activeStartDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <Box sx={{ borderRadius: 2, p: 2, border: `1px solid ${theme.palette.divider}` }}>
        <CalendarHeader
          title={year}
          onPrev={() => setActivePrevYearDate(year)}
          onNext={() => setActiveNextYearDate(year)}
          onTitleClick={() => handleClick({ day: null, month: null, year })}
          theme={theme}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1.5,
          }}
        >
          {months.map((month, idx) => {
            const firstDay = new Date(year, month, 1);
            const daysInMonth = new Date(year, 1 + month, 0).getDate();
            const startDayOfWeek = firstDay.getDay();
            const dayCells = [];
            for (let i = 0; i < startDayOfWeek; i++) dayCells.push(null);
            for (let d = 1; d <= daysInMonth; d++) dayCells.push(d);

            return (
              <div key={idx}>
                <Box
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
                    {dayCells.map((day, idx) => {
                      const dateKey =
                        day === null
                          ? null
                          : `${year}-${String(1 + month).padStart(2, "0")}-${String(
                            day
                          ).padStart(2, "0")}`;
                      const hasRequest = dateKey && requestsScheduled[dateKey];
                      return (
                        <Box
                          key={idx}
                          onClick={() => dateKey ? handleClick({ day: !isMobile ? day : null, month, year }) : null}
                          sx={{
                            aspectRatio: "1",
                            borderRadius: 0.5,
                            bgcolor: dateKey ?
                              (hasRequest
                                ? theme.palette.primary.light
                                : theme.palette.action.hover
                              ) : "transparent",
                          }}
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

  // Custom Month View
  const renderMonthView = () => {
    const year = activeStartDate.getFullYear();
    const month = activeStartDate.getMonth(); // 0-based
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, 1 + month, 0).getDate();
    const startDayOfWeek = firstDay.getDay();
    const weekDays = [t("Su"), t("Mo"), t("Tu"), t("We"), t("Th"), t("Fr"), t("Sa")];
    const dayCells = [];

    for (let i = 0; i < startDayOfWeek; i++) dayCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) dayCells.push(d);

    return (
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <CalendarHeader
          title={firstDay.toLocaleString(i18n.language, { month: "long", year: "numeric" })}
          onPrev={() => setActivePrevMonthDate(month, year)}
          onNext={() => setActiveNextMonthDate(month, year)}
          onTitleClick={() => handleClick({ day: null, month, year })}
          width={{ xs: 150, sm: 200 }}
          theme={theme}
        />

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
            [theme.breakpoints.down("sm")]: {
              gap: 0.2,
            },
          }}
          {...handlers}
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
            return (
              <DayCell
                key={idx}
                dateKey={dateKey}
                hasRequest={!!hasRequest}
                onClick={() => day && handleClick({ day, month, year })}
                theme={theme}
                isMobile={isMobile}
              >
                {day}
              </DayCell>
            );
          })}
        </Box>
      </Box>
    );
  };


  return (
    <Container sx={{ pb: 5 }}>
      <SectionHeader1
        icon={<ScheduleSend sx={{ fontSize: 30 }} />}
        text={t("Requests scheduled")}
        theme={theme}
      />

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <TextFieldSearch
          placeholder={t("Search")}
          value={filter}
          onChange={handleFilterChange}
          icon={<Search />}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          {view === "year" ? renderYearView() : renderMonthView()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default RequestsScheduledCalendar;
