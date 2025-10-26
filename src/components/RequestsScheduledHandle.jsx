import React, { useState, useEffect, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import { TextFieldSearch } from "./custom";
import { SectionHeader1 } from "mui-material-custom";
import { Search, ScheduleSend } from "@mui/icons-material";
import { JobContext } from "../providers/JobContext";
import { apiCall } from "../libs/Network";
import { isAdmin } from "../libs/Validation";
import { AuthContext } from "../providers/AuthContext";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useSnackbarContext } from "../hooks/useSnackbarContext";

const RequestsScheduledCalendar = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarContext();
  const { jobs, jobsError } = useContext(JobContext);
  const { auth } = useContext(AuthContext);
  const { xs, sm, md } = useMediaQueryContext();

  const [filter, setFilter] = useState("");
  const [requests, setRequests] = useState(null);
  const [view, setView] = useState("month"); // 'month' or 'year'
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // ---- Safe date add ----
  const addDays = (dateString, days) => {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + days));
    return date.toISOString().split("T")[0];
  };

  // ---- Build scheduled map ----
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
          medicineId: medicine.id,
          medicineSinceDate: medicine.fieldSinceDate,
          medicineFrequency: medicine.fieldFrequency,
        };
        let dateKey = schedule.medicineSinceDate.split("T")[0];
        const endDate = new Date("2030-12-31");
        while (new Date(dateKey) <= endDate) {
          map[dateKey] = map[dateKey] || [];
          map[dateKey].push(schedule);
          dateKey = addDays(dateKey, schedule.medicineFrequency);
        }
      });
    });
    return map;
  }, [jobs]);

  const handleFilterChange = (e) => setFilter(e.target.value);

  // ---- Error handling ----
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

  // ---- Get requests ----
  useEffect(() => {
    (async () => {
      const result = await apiCall(
        "get",
        "/request/getRequests",
        isAdmin(auth.user) ? {} : { userId: auth.user.id }
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
  }, [auth.user, showSnackbar]);

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

  // ---- Year Selector ----
  const renderYearSelector = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 1; y <= 2030; y++) {
      years.push(y);
    }
    return (
      <Select
        size="small"
        value={activeStartDate.getFullYear()}
        onChange={(e) =>
          setActiveStartDate(new Date(`${e.target.value}-01-01`))
        }
        sx={{
          minWidth: 100,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize,
        }}
      >
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    );
  };

  // ---- Custom Year View ----
  const renderYearView = () => {
    const year = activeStartDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <Box sx={{ borderRadius: 2, p: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mb: 2, fontFamily: theme.typography.fontFamily }}
        >
          {year}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1.5,
          }}
        >
          {months.map((month) => {
            const firstDay = new Date(year, month, 1);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDayOfWeek = firstDay.getDay();
            const dayCells = [];
            for (let i = 0; i < startDayOfWeek; i++) dayCells.push(null);
            for (let d = 1; d <= daysInMonth; d++) dayCells.push(d);

            return (
              <Box
                key={month}
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
                >
                  {firstDay.toLocaleString("default", { month: "short" })}
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
                        : `${year}-${String(month + 1).padStart(2, "0")}-${String(
                            day
                          ).padStart(2, "0")}`;
                    const hasRequest = dateKey && requestsScheduled[dateKey];
                    return (
                      <Box
                        key={idx}
                        sx={{
                          aspectRatio: "1",
                          borderRadius: 0.5,
                          bgcolor: hasRequest
                            ? theme.palette.primary.light
                            : theme.palette.action.hover,
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  // ---- Custom Month View ----
  const renderMonthView = () => {
    const year = activeStartDate.getFullYear();
    const month = activeStartDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDay.getDay();
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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
        {/* <Typography
          variant="subtitle1"
          textAlign="center"
          sx={{ mb: 1, fontFamily: theme.typography.fontFamily }}
        >
          {firstDay.toLocaleString("default", { month: "long", year: "numeric" })}
        </Typography> */}
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
          {/* Previous month */}
          <Button
            size="small"
            variant={"contained"}
            onClick={() => {
              const prev = new Date(year, month - 1, 1);
              setActiveStartDate(prev);
            }}
          >
            ←
          </Button>

          {/* Month name */}
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {firstDay.toLocaleString("default", { month: "long", year: "numeric" })}
          </Typography>

          {/* Next month */}
          <Button
            size="small"
            variant={"contained"}
            onClick={() => {
              const next = new Date(year, month + 1, 1);
              setActiveStartDate(next);
            }}
          >
            →
          </Button>
        </Box>
        
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
                : `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
                    2,
                    "0"
                  )}`;
            const hasRequest = dateKey && requestsScheduled[dateKey];
            return (
              <Box
                key={idx}
                sx={{
                  // Applies only to xs screens
                  [theme.breakpoints.only('xs')]: {
                    aspectRatio: "1"
                  },
                  // Applies to sm and up
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
                <Typography
                  variant="caption"
                  display="block"
                  textAlign="center"
                  lineHeight={1.8}
                >
                  {day ?? ""}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: xs ? 2 : 4 }}>
      <SectionHeader1>
        <ScheduleSend fontSize="large" /> {t("Future Requests")}
      </SectionHeader1>

      {/* --- Responsive layout --- */}
      <Grid container spacing={1} alignItems="center" justifyContent="flex-end">
        {/* --- Search input --- */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={6}
          xl={6}
          sx={{ textAlign: "right" }}
        >
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
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} sx={{ textAlign: "right" }}>
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
            {view === "year" && renderYearSelector()}
          </Box>
        </Grid>
      </Grid>

      {/* --- Calendar --- */}
      <Box sx={{ mt: 2 }}>{view === "month" ? renderMonthView() : renderYearView()}</Box>

      {requests && requests.length === 0 && (
        <Box sx={{ padding: theme.spacing(2) }}>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            fontStyle="italic"
            py={3}
          >
            {t("No scheduled requests present yet")}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default React.memo(RequestsScheduledCalendar);
