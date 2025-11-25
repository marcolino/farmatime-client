import { useState } from "react";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";

const HelpDialogContent = ({ t, setShowHelpIcon }) => {
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
    <Box sx={{ display: "flex", flexDirection: "column", maxHeight: "50vh" }}>
      <Box sx={{ overflowY: "auto", pr: 1, flexGrow: 1 }}>
        {[...Array(14)].map((_, i) => (
          <Typography key={i}>{t("Your help text goes here...")}</Typography>
        ))}
        <Typography>{"End"}</Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={hideForever} onChange={handleChange} />}
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: "0.9rem",
              fontStyle: "italic",
            },
          }}
          label={t(
            "Hide help button (this text is always accessible from main menu)"
          )}
        />
      </Box>
    </Box>
  );
};

export default HelpDialogContent;
