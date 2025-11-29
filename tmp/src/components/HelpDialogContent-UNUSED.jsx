import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import VideoPlayer from "../components/VideoPlayer";

const HelpDialogContent = ({ setShowHelpIcon }) => {
  const { t } = useTranslation();
  const [hideForever, setHideForever] = useState(
    localStorage.getItem("hideHelpButton") === "true"
  );

  const handleChange = (e) => {
    const checked = e.target.checked;
    setHideForever(checked);
    localStorage.setItem("hideHelpButton", checked ? "true" : "false");
    setShowHelpIcon(!checked); // hide Fab immediately if checked
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", maxHeight: "100vh" }}>
      {/*
      <Box sx={{ overflowY: "auto", pr: 1, flexGrow: 1 }}>
        <Typography sx={{mt: 1}}>
          {t("This app allows users to schedule medicines prescription requests for one or more patients, so that prescriptions will arrive in your inbox at the right moment.")}
        </Typography>
        {!isLoggedIn && (
          <Typography sx={{mt: 2}}>
            {t("Initially you have to register, and then login in the app, of course. You can also just use your Google account to login quickly.")}
          </Typography>
        )}
        <Typography sx={{mt: 2}}>
          {t("As the first step you'll set up an \"activity\": the app will ask you the name and the email of the patient, and the name and the email of the doctor to whom to ask the prescription to.")}
        </Typography>
        <Typography sx={{mt: 2}}>
          {t("As the second step you'll choose one or more medicines.") + "\n"}
          {t("Along with the medicine, you'll choose the date the first prescription will be requested, and the frequency of the following requests.") + "\n"}
          {t("For example, if you need Aspirine, and you have a none or a few left in your medicine chest, you should choose the right aspirine packaging in the list you'll get after typing the first chars of the medicine name; then you can choose tomorrow as the first request date, and 30 days frequency if you think you will consume it all in a month.")}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {t("As the third (and last) step, you simply review your choices, and confirm the activity.")}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {t("The app is as simple as this.")}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {t("You can set up as many activities as you want, for the number of patients you want. But, since the app is currently completelely free to use, the total number of requests is currently limited to {{maxRequestsPerUser}} per user.", {maxRequestsPerUser: config.ui.jobs.maxRequestsPerUser})}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {t("If you want, you can customize the email that will be sent to the doctor, in the main menu \"advanced options\".")}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {t("The app is multilingual; you can choose the language you prefer clicking on the flag in the footer. Currently we support English, Italian and French.")}
        </Typography>
        <Typography sx={{ my: 2, textAlign: "center" }}>
          ■
        </Typography>

      </Box>
      */}
      <div>
        <VideoPlayer
          src="/videos/presentation-it.mp4"
          autoPlay={true}
          controls
          muted={false}
        />
        <Box sx={{ mt: 0 }}>
          <FormControlLabel
            control={<Checkbox checked={hideForever} onChange={handleChange} />}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "0.8rem",
                fontStyle: "italic",
                color: "text.secondary",
              },
            }}
            label={t("Hide help button")} /* (this text is always accessible from main menu) */
          />
        </Box>
      </div>
    </Box>
  );
};

export default HelpDialogContent;
