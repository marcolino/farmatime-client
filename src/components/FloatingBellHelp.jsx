import { useContext } from "react";
import { Fab } from "@mui/material";
import { EmojiObjects } from "@mui/icons-material";
import { HelpContext } from "../providers/HelpContext";
import { useOpenHelpDialog } from "../hooks/useOpenHelpDialog";

const FloatingBellHelp = () => {
  const { showHelpIcon } = useContext(HelpContext);
  const openHelpDialog = useOpenHelpDialog();

  if (!showHelpIcon) return null;

  return (
    <Fab
      color="primary"
      onClick={openHelpDialog}
      sx={{
        position: "fixed",
        bottom: 72,
        right: 36,
      }}
    >
      <EmojiObjects
        sx={{
          color: "gold",
          filter: "drop-shadow(2px 2px rgba(0,0,0,0.33))",
        }}
      />
    </Fab>
  );
};

export default FloatingBellHelp;
