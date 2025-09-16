import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthContext";
import useInactivityTimer from "../hooks/useInactivityTimer";
import { useDialog } from "../providers/DialogContext";
import config from "../config";


const SessionProvider = () => {
  const { isLoggedIn, signOut } = useContext(AuthContext);
  const { t } = useTranslation();
  const { showDialog } = useDialog();
  const [resetTimer, setResetTimer] = useState(false);

  const handleTimeout = async () => {
    showDialog({
      title: t("Confirm still using the app"),
      message: t("Are you still using the app?"),
      confirmText: t("Yes, I'm still using it"),
      cancelText: t("No, logout please"),
      onConfirm: () => {
        setResetTimer((prev) => !prev); // trigger timer reset
      },
      onCancel: async () => {
        const ok = await signOut();
        console.log("signout result:", ok);
        //navigate("/"); // navigate to home page, because guest user could not be entitled to stay on current page
      },
      autoCancelAfterSeconds: config.auth.clientSessionExpirationResponseMaximumSeconds,
    })
  };

  const enabled = isLoggedIn && config.auth.clientSessionExpirationSeconds > 0;
  const delay = enabled ? config.auth.clientSessionExpirationSeconds * 1000 : null;

  // start timer only when enabled (logged in and timeout > 0)
  if (enabled) {
    console.log("+++ SessionProvider - setting useInactivityTimer to showdialog, waiting", config.auth.clientSessionExpirationSeconds, "seconds")
  }
  useInactivityTimer(enabled, delay, handleTimeout, resetTimer);

  return null;
};

export default SessionProvider;
