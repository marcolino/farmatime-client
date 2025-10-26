import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import Calendar from "react-calendar";
import { JobContext } from "../providers/JobContext";
import { apiCall } from "../libs/Network";
import {
  Container,
  Box,
  Typography,
} from "@mui/material";
import { TextFieldSearch } from "./custom";
import { SectionHeader1 } from "mui-material-custom";
import { Search, ScheduleSend } from "@mui/icons-material";
import { isAdmin } from "../libs/Validation";
import { AuthContext } from "../providers/AuthContext";
import { useMediaQueryContext } from "../providers/MediaQueryContext";
import { useSnackbarContext } from "../hooks/useSnackbarContext";

const RequestsScheduledCalendar = () => {
  const theme = useTheme();

  const [view, setView] = useState("month"); // 'month' or 'year'
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const { showSnackbar } = useSnackbarContext();
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");
  const [requests, setRequests] = useState(null);
  const { jobs, jobsError } = useContext(JobContext);
  const { auth } = useContext(AuthContext);
  const { isMobile } = useMediaQueryContext();

  const addDays = (dateString, days) => {
    const [y, m, d] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + days)); // pure UTC math
    return date.toISOString().split('T')[0]; // back to "YYYY-MM-DD"
  };

  const requestsScheduled = React.useMemo(() => {
    const map = {}
    jobs.forEach(job => {
      job.medicines.forEach(medicine => {
        const schedule = {};
        schedule.jobId = job.id;
        schedule.patient = job.patient;
        schedule.doctor = job.doctor;
        schedule.isActive = job.isActive;
        schedule.timestampCreation = job.timestampCreation;
        schedule.timestampLastModification = job.timestampLastModification;
        schedule.isActive = job.isActive;
        schedule.medicineId = medicine.id; // "med_004763025"

        schedule.medicineSinceDate = medicine.fieldSinceDate;
        schedule.medicineFrequency = medicine.fieldFrequency; // TODO: create schedules every fieldFrequency...

        let dateKey = schedule.medicineSinceDate.split('T')[0]; // get only YYYY-MM-DD
        const endDate = new Date('2030-12-31'); // TODO: set a reasonable limit date for future requests, into config
        while (new Date(dateKey) <= endDate) {
          map[dateKey] = map[dateKey] || [];
          map[dateKey].push(schedule);
          dateKey = addDays(dateKey, schedule.medicineFrequency);
          console.log("dateKey:", dateKey);
        }
      });
    });
    return map;
  }, [jobs]);

  // Add this useEffect to force refresh when component mounts
  useEffect(() => {
    // This will trigger a re-render with fresh data from context
    if (requests) {
      console.log("RequestsScheduledTable mounted, requests count:", requests.length);
    } else {
      console.log("RequestsScheduledTable mounted, requests is null yet");
    }
  }, [requests]); // Empty dependency array means this runs once when component mounts

  // Get all requests on mount
  useEffect(() => {
    (async () => {
      // get all users request for admin users, and only her requests for other users
      const result = await apiCall("get", "/request/getRequests", isAdmin(auth.user) ? {} : { userId: auth.user.id });
      if (result.err) {
        showSnackbar(result.message, result.status === 401 ? "warning" : "error");
      } else {
  
        // Status updates could arrive in mixed order, and with some seconds delay...
        for (const request of result.requests) {
          [request.lastStatus, request.lastStatusDate, request.lastReason] =
            getHighestStatus(request.events);
        }

        setRequests(result.requests);
      }
    })();
    return () => {
      //console.log("RequestsScheduledTable unmounted");
    };
  }, [auth.user, showSnackbar]);
  
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

  /**
   * WebHooks do not necessarily arrive in order, so on server we store all events, and
   * consider the 'last' status the one with the highest priority, not the last arrived.
   */
  const getHighestStatus = (events) => {
    if (!events || events.length === 0) return [null, null, null];

    const statuses = {
      "request": 1,
      "delivered": 2,
      "hard_bounce": 3,
      "soft_bounce": 4,
      "invalid_email": 5,
      "blocked": 6,
      "spam": 7,
      "unsubscribed": 8,
      "error": 9,
      "deferred": 10,
      "unforeseen": 99,
      "click": 101,
      "opened": 102,
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
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
      <SectionHeader1>
        <ScheduleSend fontSize="large" /> {t("Future Requests")}
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

      <Box className="p-4 rounded-2xl shadow bg-white">
        <Calendar
          minDetail="year"
          maxDetail="month"
          defaultView="month"
          tileContent={({ date, view }) => {
            const dateKey = date.toISOString().split('T')[0];
            const items = requestsScheduled[dateKey];
            if (view === 'month' && items) {
              return (
                <div className="mt-1 text-xs text-blue-600">
                  {items.length} {t("Request")}
                </div>
              );
            }
          }}
          tileClassName={({ date }) => {
            const dateKey = date.toISOString().split('T')[0];
            return requestsScheduled[dateKey]
              ? 'bg-blue-50 hover:bg-blue-100 rounded-md transition'
              : undefined
            ;
          }}
        />
      </Box>

      {requests && requests.length === 0 && (
        <Box sx={{ padding: theme.spacing(2) }}>
          <Typography variant="body1" color="text.secondary" textAlign="center" fontStyle="italic" py={3}>
            {t("No scheduled requests present yet")}
          </Typography>
        </Box>
      )}
  
    </Container>
  );
};

export default React.memo(RequestsScheduledCalendar);
