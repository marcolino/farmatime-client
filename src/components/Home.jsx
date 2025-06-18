import React from "react";
import { useContext } from "react";
// import { Paper, Typography } from "@mui/material";
// import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthContext";
import { JobContext } from "../providers/JobContext";
// import FloatingLogo from "./FloatingLogo";
// import { JobMedicines }  from "./JobMedicines";
// import { MedicineInputAutocomplete }  from "./MedicineInputAutocomplete";
import SignIn from "./auth/SignIn";
import Landing from "./Landing";
import JobFlow from "./JobFlow";
import JobsHandle from "./JobsHandle";
// import EmailTemplateEditor from "./EmailTemplateEditor";
// import JobFlowStepperExample from "./JobFlowStepperExample";
//import config from "../config";


function Home() {
  const { /*auth,*/ isLoggedIn, didSignInBefore } = useContext(AuthContext);
  const { job, setJob } = useContext(JobContext);

  console.log("HOME");
  // if (typeof auth?.user === "undefined") {
  //   console.log("auth.user is undefined", auth);
  //   return; // if auth.user is undefined, we don't know yet about user authentication...
  // }

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
  //   <EmailTemplateEditor />
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
