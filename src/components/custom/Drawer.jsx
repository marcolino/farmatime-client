import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { JobContext } from "../../providers/JobContext";
import { useDialog } from "../../providers/DialogContext";
import { Drawer } from "@mui/material";
import {
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import config from "../../config";

const CustomDrawer = ({ theme, sections, drawerOpen, toggleDrawer }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { jobDraftIsDirty, setJobDraftDirty } = useContext(JobContext);
  const { showDialog } = useDialog();
  
  const checkJobDraftIsDirty = (title, proceed) => {
    if (!jobDraftIsDirty) {
      proceed();
    } else {
      showDialog({
        title,
        message: t("Are you sure you want to cancel the job edits you have just done? All changes will be lost."),
        confirmText: t("Yes, cancel changes"),
        cancelText: t("No, continue"),
        onConfirm: () => {
          setJobDraftDirty(false);
          proceed();
        },
      });
    }
  };

  const goToSection = (destination) => {
    const proceed = () => navigate(destination.to ?? "/", { replace: true });
    checkJobDraftIsDirty(destination.text, proceed);
  };

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      sx={{
        top: config.ui.headerHeight + "px",
        '& .MuiDrawer-paper': {
          top: config.ui.headerHeight + "px", // to make sure the Drawer contents also respects this offset
        },
      }}
    >
      <Box
        sx={{ width: 200 }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List /*dense*/>
          {sections.map(section => (
            <ListItem
              key={section.key}
              onClick={() => goToSection(section)}
              sx={{ borderBottom: 1, borderColor: theme.palette.primary.secondary }}
            >
              <Box sx={{ display: "flex", alignItems: "center", color: "text.primary" }}>
                {section.icon} &emsp; <ListItemText primary={section.text} />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default CustomDrawer;
