import { useState } from "react";
import { HelpContext } from "./HelpContext";

export const HelpProvider = ({ children }) => {
  const [showHelpIcon, setShowHelpIcon] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem("hideHelpButton");
    return saved !== "true"; // if hideHelpButton=true, showHelpIcon=false
  });

  return (
    <HelpContext.Provider value={{ showHelpIcon, setShowHelpIcon }}>
      {children}
    </HelpContext.Provider>
  );
};
