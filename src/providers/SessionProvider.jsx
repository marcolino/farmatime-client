import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthProvider";
import useInactivityTimer from "../hooks/useInactivityTimer";
//import DialogConfirm from "../components/DialogConfirm";
import { useDialog } from "../providers/DialogProvider";
import config from "../config";


const SessionProvider = () => {
  const { isLoggedIn, signOut } = useContext(AuthContext);
  const { t } = useTranslation();
  const { showDialog } = useDialog();
  const [resetTimer, setResetTimer] = useState(false);

  //const [showDialog, setShowDialog] = useState(false);
  
  // const handleLogout = async () => {
  //   setShowDialog(false);
  //   await signOut();
  //   //setAuth({ user: false }); // user is not set, but not null, it means she has an account
  // };

  // const handleContinue = () => {
  //   setShowDialog(false);
  // };

  const handleTimeout = async () => {
    //setShowDialog(true);
    showDialog({
      title: t("Confirm still using the app"),
      message: t("Are you still using the app?"),
      confirmText: t("Yes, I'm still using it"),
      cancelText: t("No, logout please"),
      onConfirm: () => {
        setResetTimer((prev) => !prev); // trigger timer reset
      },
      // onConfirm: () => { // just setup next useInactivityTimer
      //   console.log("+++ SessionProvider - before confirm");
      //   // if (config.auth.clientSessionExpirationSeconds > 0) {
      //   //   useInactivityTimer(isLoggedIn, config.auth.clientSessionExpirationSeconds * 1000, handleTimeout);
      //   // }
      //   console.log("+++ SessionProvider - after confirm and useInactivityTimer");
      // },
      onCancel: async () => {
        const ok = await signOut();
        console.log("signout result:", ok);
        navigate("/"); // navigate to home page, because guest user could not be entitled to stay on current page
      },
      autoCancelAfterSeconds: config.auth.clientSessionExpirationResponseMaximumSeconds,
    })
  };

  // start timer only when logged in
  if (config.auth.clientSessionExpirationSeconds > 0) {
    console.log("+++ SessionProvider - setting useInactivityTimer to showdialog, waiting", config.auth.clientSessionExpirationSeconds * 1000, "ms")
    useInactivityTimer(isLoggedIn, config.auth.clientSessionExpirationSeconds * 1000, handleTimeout, resetTimer);
  }

  // useEffect(() => {
  //   if (showDialog) {
  //     const timer = setTimeout(async () => {
  //       //console.log(`SessionProvider, clientSessionExpirationResponseMaximumSeconds ${config.auth.clientSessionExpirationResponseMaximumSeconds} seconds timeout expired`);
  //       setShowDialog(false);
  //       await signOut();
  //       //setAuth({ user: false }); // user is not set, but not null, it means she has an account
  //     }, config.auth.clientSessionExpirationResponseMaximumSeconds * 1000);
  //     //console.log(`SessionProvider, set timer: ${timer}`);

  //     return () => {
  //       clearTimeout(timer);
  //       //console.log(`SessionProvider, cleared timer: ${timer}`);
  //     };
  //   }
  // }, [showDialog, signOut]);

  return null;

  // // we use DialogConfirm here instead of useDialog context and showDialog, to be able to autoclose it
  // return (
  //   showDialog && (
  //     <DialogConfirm
  //       open={showDialog}
  //       onClose={handleContinue}
  //       onCancel={handleLogout}
  //       onConfirm={handleContinue}
  //       title={t("Confirm still using the app")}
  //       message={t("Are you still using the app?")}
  //       confirmText={t("Continue")}
  //       cancelText={t("Logout")}
  //     />
  //   )
  // );
};

export default SessionProvider;
