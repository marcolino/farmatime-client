import { useDialog } from "../providers/DialogContext";
import { useContext } from "react";
import { HelpContext } from "../providers/HelpContext";
import HelpDialogContent from "../components/HelpDialogContent";
import { useTranslation } from "react-i18next";

export const useOpenHelpDialog = () => {
  const { t } = useTranslation();
  const { showDialog } = useDialog();
  const { setShowHelpIcon } = useContext(HelpContext);

  const openHelpDialog = () => {
    showDialog({
      title: t("Presentation of the app"),
      message: <HelpDialogContent setShowHelpIcon={setShowHelpIcon} />,
      confirmText: t("Ok"),
    });
  };

  return openHelpDialog;
};

/*
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
//import { AuthContext } from "../providers/AuthContext";
import { HelpContext } from "../providers/HelpContext";
//import HelpDialogContent from "../components/HelpDialogContent";
import { useDialog } from "../providers/DialogContext";
import VideoPlayer from "../components/VideoPlayer";


export const useOpenHelpDialog = () => {
  const { t } = useTranslation();
  const { showDialog } = useDialog();
  const { setShowHelpIcon } = useContext(HelpContext);
  const [hideForever, setHideForever] = useState(
    localStorage.getItem("hideHelpButton") === "true"
  );

  const handleChange = (e) => {
    const checked = e.target.checked;
    setHideForever(checked);
    localStorage.setItem("hideHelpButton", checked ? "true" : "false");
    setShowHelpIcon(!checked); // hide Fab immediately if checked
  };
  
  const openHelpDialog = () => {
    showDialog({
      title: t("Presentation of the app"),
      message: (
        <div>
          <VideoPlayer
            src="/videos/presentation-it.mp4"
            autoPlay={true}
            controls
            muted={false}
          />
          {/* <HelpDialogContent t={t} setShowHelpIcon={setShowHelpIcon} />, * /}
          <Box sx={{ mt: 0 }}>
            <FormControlLabel
              control={<Checkbox checked={hideForever} onChange={handleChange} />}
              sx={{
                "& .MuiFormControlLabel-label": {
                  m:0, p:0,
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                },
              }}
              label={t(
                "Hide help button"
              )}
            />
          </Box>
        </div>
      ),
      confirmText: t("Ok"),
    });
  };

  return openHelpDialog;
};
*/