import { useState, useMemo } from "react";
import { HelpContext } from "./HelpContext";

export const HelpProvider = ({ children }) => {
  const [open, setOpen] = useState(false); // dialog open state
  const [showHelpIcon, setShowHelpIcon] = useState(
    localStorage.getItem("hideHelpButton") !== "true"
  );

  const value = useMemo(() => ({
    showHelpIcon,
    setShowHelpIcon,
    openHelp: () => setOpen(true),
    closeHelp: () => setOpen(false),
    open
  }), [showHelpIcon, open]);

  return (
    <HelpContext.Provider value={value}>
      {children}
    </HelpContext.Provider>
  );
};
