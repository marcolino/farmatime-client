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
      title: t("How does this app work?"),
      message: <HelpDialogContent t={t} setShowHelpIcon={setShowHelpIcon} />,
      confirmText: t("Ok"),
    });
  };

  return openHelpDialog;
};
