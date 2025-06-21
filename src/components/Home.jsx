import React, { useEffect } from "react";
import { useContext } from "react";
// import { Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthContext";
import { JobContext } from "../providers/JobContext";
import { useSnackbarContext } from "../providers/SnackbarProvider";
// import FloatingLogo from "./FloatingLogo";
// import { JobMedicines }  from "./JobMedicines";
// import { MedicineInputAutocomplete }  from "./MedicineInputAutocomplete";
import SignIn from "./auth/SignIn";
import Landing from "./Landing";
import JobFlow from "./JobFlow";
import JobsHandle from "./JobsHandle";
// import JobEmailTemplateEditor from "./JobEmailTemplateEditor";
// import JobFlowStepperExample from "./JobFlowStepperExample";
//import config from "../config";


function Home() {
  const { /*auth,*/ isLoggedIn, didSignInBefore } = useContext(AuthContext);
  const { job, jobError } = useContext(JobContext);
  const { showSnackbar } = useSnackbarContext();
  const { t } = useTranslation();

  console.log("HOME");
  // if (typeof auth?.user === "undefined") {
  //   console.log("auth.user is undefined", auth);
  //   return; // if auth.user is undefined, we don't know yet about user authentication...
  // }

  // Handle secure storage errors
  useEffect(() => {
    if (jobError) {
      // Show toast, dialog, or alert
      showSnackbar(t("Error while {{what}} data to secure storage: {{error}}",
        {
          what: jobError.type === "load" ? "loading" : jobError.type === "store" ? "storing" : t("unforeseen action"),
          error: jobError.e.message
        }
      ), "error");
    }
  }, [jobError, showSnackbar, t]);

  if (job?.isCompleted) {
    console.log("job is completed, show JobsHandle component");
    return (
      <JobsHandle />
    );
  }

  if (isLoggedIn) {
    console.log("user is logged in, show JobFlow component");
    return (
      <JobFlow />
    );
  }

  if (didSignInBefore) {
    console.log("user is not logged in, but did sign in before: show SignIn component");
    return (
      <SignIn />
    );
  }

  console.log("user is not logged in, and did never sign in before: show Landing component");
  return (
    <Landing />
  );

  // return (
  //   <JobFlow />
  // );

  // return (
  //   <JobFlowStepperExample />
  // );

  // return (
  //   <JobEmailTemplateEditor />
  // );

  // return (
  //   <JobMedicines />
  // );

  // return (
  //   <FloatingLogo text={config.title} />
  //   <JobMedicines />
  // );

  // return (
  //   <Paper sx={{ padding: 4 }}>
  //     {!auth?.user &&
  //       <Typography>{t("Home page for guest user")}</Typography>
  //     }
  //     {auth?.user &&
  //       <Typography>{t("Home page for logged user")}</Typography>
  //     }
  //     {/* <Button onClick={() => showSnackbar("This is a custom snackbar", "info")} fullWidth={false}>Show Snackbar</Button> */}
  //   </Paper>
  // );
}

export default React.memo(Home);
