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
  FormControl,
} from "@mui/material";
import { JobContext } from "../providers/JobContext";
import { AuthContext } from "../providers/AuthContext";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useSnackbarContext } from "../hooks/useSnackbarContext";
import { apiCall } from "../libs/Network";
import { TextFieldSearch } from "./custom";
import { SectionHeader1 } from "mui-material-custom";
import { Search, ScheduleSend } from "@mui/icons-material";
import { isAdmin } from "../libs/Validation";
import Calendar from "react-calendar";

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
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // --- Safe UTC day addition ---
  const addDays = (dateString, days) => {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + days));
    return date.toISOString().split("T")[0];
  };

  // --- Build map of scheduled medicine dates ---
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

  // --- Filtering ---
  const handleFilterChange = (e) => setFilter(e.target.value);

  // --- Jobs error handling ---
  useEffect(() => {
    if (jobsError) {
      const message =
        jobsError.type === "load"
          ? `${t("Failed to load jobs")}. ${t("Please try again")}.`
          : jobsError.type === "store"
          ? `${t("Failed to store jobs")}. ${t("Please try again")}.`
          : jobsError.message ?? "An unexpected error occurred.";
      showSnackbar(message, "error");
    }
  }, [jobsError, showSnackbar, t]);

  // --- Load requests on mount ---
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
          [request.lastStatus, request.lastStatusDate, request.lastReason] = getHighestStatus(
            request.events
          );
        }
        setRequests(result.requests);
      }
    })();
  }, [auth.user, showSnackbar]);

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

  // --- Year view renderer ---
  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const firstDay = new Date(activeYear, 0, 1);

    return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <FormControl size="small">
            <Select
              value={activeYear}
              onChange={(e) => setActiveYear(Number(e.target.value))}
              sx={{
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.body2.fontSize,
              }}
            >
              {Array.from({ length: 10 }, (_, i) => activeYear - 5 + i).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2}>
          {months.map((month) => {
            const monthDate = new Date(activeYear, month, 1);
            const daysInMonth = new Date(activeYear, month + 1, 0).getDate();
            const monthName = monthDate.toLocaleString("default", { month: "long" });

            return (
              <Grid key={month} item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    p: 1,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.body2.fontSize,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    align="center"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    {monthName}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 0.5,
                    }}
                  >
                    {Array.from({ length: daysInMonth }, (_, d) => {
                      const dateKey = `${activeYear}-${String(month + 1).padStart(2, "0")}-${String(
                        d + 1
                      ).padStart(2, "0")}`;
                      const items = requestsScheduled[dateKey];
                      return (
                        <Box
                          key={d}
                          sx={{
                            textAlign: "center",
                            borderRadius: 1,
                            bgcolor: items
                              ? theme.palette.primary.light + "33"
                              : "transparent",
                            fontSize: "0.7rem",
                            lineHeight: 1.8,
                            cursor: "default",
                          }}
                        >
                          {d + 1}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: xs ? 2 : 4 }}>
      <SectionHeader1>
        <ScheduleSend fontSize="large" /> {t("Future Requests")}
      </SectionHeader1>

      {/* --- Toolbar --- */}
      <Grid container spacing={1} alignItems="center" justifyContent="flex-end">
        {/* Search field */}
        <Grid item xs={12} lg={6} sx={{ textAlign: "right" }}>
          <TextFieldSearch
            label={t("Search")}
            value={filter}
            size="small"
            margin="dense"
            onChange={handleFilterChange}
            startIcon={<Search />}
            fullWidth={!xs && !sm && !md}
            sx={{ color: theme.palette.text.primary }}
          />
        </Grid>

        {/* View toggle */}
        <Grid item xs={12} lg={6} sx={{ textAlign: "right" }}>
          <Box sx={{ display: "inline-flex", gap: 1 }}>
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

      {/* --- Calendar / Year view --- */}
      <Box sx={{ mt: 2, fontFamily: theme.typography.fontFamily }}>
        {view === "month" ? (
          <Box
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              p: 2,
              boxShadow: theme.shadows[1],
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Calendar
              minDetail="month"
              maxDetail="month"
              value={activeStartDate}
              onActiveStartDateChange={({ activeStartDate }) =>
                setActiveStartDate(activeStartDate)
              }
              tileContent={({ date }) => {
                const dateKey = date.toISOString().split("T")[0];
                const items = requestsScheduled[dateKey];
                return items ? (
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: theme.palette.primary.main,
                      fontFamily: theme.typography.fontFamily,
                    }}
                  >
                    {items.length} {t("Req")}
                  </div>
                ) : null;
              }}
              tileClassName={({ date }) => {
                const dateKey = date.toISOString().split("T")[0];
                return requestsScheduled[dateKey]
                  ? "has-request"
                  : undefined;
              }}
              onClickDay={() => {}}
            />
          </Box>
        ) : (
          renderYearView()
        )}
      </Box>

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
