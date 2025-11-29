import { useContext } from "react";
import { Fab } from "@mui/material";
import { EmojiObjects } from "@mui/icons-material";
//import { HelpContext } from "../providers/HelpContext";
//import { useOpenHelpDialog } from "../hooks/useOpenHelpDialog";
//import HelpVideoDialog from "../components/HelpVideoDialog";
import { HelpContext } from "../providers/HelpContext";

const FloatingBellHelp = () => {
  const { showHelpIcon, openHelp } = useContext(HelpContext);
  //const openHelpDialog = useOpenHelpDialog();

  if (!showHelpIcon) return null;
  //const [open, setOpen] = useState(false);
  
  return (
    <Fab
      color="info"
      onClick={openHelp} 
      sx={{
        position: "fixed",
        bottom: 72,
        right: 36,
      }}
    >
      <EmojiObjects
        fontSize="large"
        sx={{
          //color: "gold",
          //filter: "drop-shadow(2px 2px rgba(0,0,0,0.33))",
        }}
      />
    </Fab>
  );
};

export default FloatingBellHelp;
