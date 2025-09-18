import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { JobContext } from "./JobProvider";
import { i18n } from "../i18n";

export function useGuardedNavigation() {
  const navigate = useNavigate();
  const { jobIsChanged } = useContext(JobContext);

  return (to, options) => {
    if (jobIsChanged) {
      const confirmed = window.confirm(
        i18n.t("You have unsaved changes. Do you really want to leave this page?")
      );
      if (!confirmed) return;
    }
    navigate(to, options);
  };
}