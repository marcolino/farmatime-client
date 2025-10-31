import React, { useState, useEffect, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import Calendar from "react-calendar";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { TextFieldSearch } from "./custom";
import { SectionHeader1 } from "mui-material-custom";
import { Search, ScheduleSend } from "@mui/icons-material";
import { JobContext } from "../providers/JobContext";
import { AuthContext } from "../providers/AuthContext";
import { isAdmin } from "../libs/Validation";
import { apiCall } from "../libs/Network";
import { useSnackbarContext } from "../hooks/useSnackbarContext";
import { useMediaQueryContext } from "../providers/MediaQueryContext";

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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Add days safely in UTC
  const addDays = (dateString, days) => {
    const [y, m, d] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + days));
    return date.toISOString().split("T")[0];
  };

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

  // Get all requests on mount
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

  /** Custom compact year view **/
  const renderYearView = () => {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          mt: 2,
        }}
      >
        {Array.from({ length: 12 }, (_, month) => {
          const daysInMonth = new Date(selectedYear, 1 + month, 0).getDate();
          const monthLabel = new Date(selectedYear, month).toLocaleString("default", {
            month: "short",
          });

          return (
            <Box
              key={month}
              sx={{
                border: "1px solid " + theme.palette.divider,
                borderRadius: 2,
                p: 1,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              <Typography
                variant="subtitle2"
                textAlign="center"
                sx={{ mb: 0.5, fontFamily: theme.typography.fontFamily }}
              >
                {monthLabel}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 0.3,
                }}
              >
                {Array.from({ length: daysInMonth }, (_, day) => {
                  const dateKey = `${selectedYear}-${String(1 + month).padStart(2, "0")}-${String(
                    day + 1
                  ).padStart(2, "0")}`;
                  const hasRequest = requestsScheduled[dateKey];
                  return (
                    <Box
                      key={day}
                      sx={{
                        width: "100%",
                        aspectRatio: "1",
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
                    />
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: xs ? 2 : 4 }}>
      <SectionHeader1>
        <ScheduleSend fontSize="large" /> {t("Future Requests")}
      </SectionHeader1>

      {/* --- Top controls row --- */}
      <Grid
        container
        spacing={1}
        alignItems="center"
        justifyContent="flex-end"
        sx={{ mb: 2 }}
      >
        {/* Search */}
        <Grid item xs={12} sm={12} md={12} lg={5} xl={5} textAlign="right">
          <TextFieldSearch
            label={t("Search")}
            value={filter}
            size="small"
            margin="dense"
            onChange={handleFilterChange}
            startIcon={<Search />}
            sx={{ color: theme.palette.text.primary }}
          />
        </Grid>

        {/* Buttons + Year selector */}
        <Grid item xs={12} sm={12} md={12} lg={7} xl={7} textAlign="right">
          <Box
            sx={{
              display: "inline-flex",
              gap: 1,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
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

            {view === "year" && (
              <TextField
                type="number"
                size="small"
                label={t("Year")}
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                inputProps={{ min: 2000, max: 2100 }}
                sx={{ width: 100 }}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* --- Calendar container --- */}
      <Box
        className="p-4 rounded-2xl shadow bg-white"
        sx={{
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {view === "month" ? (
          <Calendar
            minDetail="year"
            maxDetail="month"
            view="month"
            value={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) =>
              setActiveStartDate(activeStartDate)
            }
            tileContent={({ date }) => {
              const dateKey = date.toISOString().split("T")[0];
              const items = requestsScheduled[dateKey];
              if (items) {
                return (
                  <div
                    className="text-xs text-blue-600"
                    style={{ fontFamily: theme.typography.fontFamily }}
                  >
                    {items.length} {t("Request")}
                  </div>
                );
              }
            }}
            tileClassName={({ date }) => {
              const dateKey = date.toISOString().split("T")[0];
              return requestsScheduled[dateKey]
                ? "bg-blue-50 hover:bg-blue-100 rounded-md transition"
                : undefined;
            }}
            // readonly
            onClickDay={() => {}}
            onClickMonth={() => {}}
            onClickYear={() => {}}
            selectRange={false}
          />
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
