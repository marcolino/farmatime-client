import React, { useEffect, useContext, lazy } from "react";
import { useNavigate } from "react-router-dom";
// import { Paper, Typography } from "@mui/material";
//import { useTranslation } from "react-i18next";
import { AuthContext } from "../providers/AuthContext";
import { JobContext } from "../providers/JobContext";
// import FloatingLogo from "./FloatingLogo";

// //import SignIn from "./auth/SignIn";
// const SignIn = lazy(() => import("./auth/SignIn"));

// //import Landing from "./Landing";
// const Landing = lazy(() => import("./Landing"));

// //import JobFlow from "./JobFlow";
// const JobFlow = lazy(() => import("./JobFlow"));

// //import JobsHandle from "./JobsHandle";
// const JobsHandle = lazy(() => import("./JobsHandle"));

// const TicketTeatherMap = lazy(() => import("./TicketTeatherMap"));

function Home() {
  const { isLoggedIn, didSignInBefore } = useContext(AuthContext);
  const { jobs  } = useContext(JobContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    //console.log("Home component mounted, jobs:", jobs);
    if (isLoggedIn) { // user is logged in
      if (jobs.length > 0/* && jobs[0].isConfirmed*/) {
        //console.log("user is logged in and at least one job is present and completed, show JobsHandle component");
        return navigate("/jobs-handle", { replace: true });
      } else {
        //console.log("user is logged in but no job is present and completed, show job component");
        return navigate("/job/new", { replace: true });
      }
    } else { // user is not logged in
      if (didSignInBefore) { // user is not logged in but did log in before
        //console.log("user is not logged in, but did sign in before: show SignIn component");
        return navigate("/signin", { replace: true });
      }

      // user is not logged in and never did sign in before
      //console.log("user is not logged in, and never did sign in before: show landing component");
      return navigate("/landing", { replace: true });
    }
    
  }, [jobs, isLoggedIn, didSignInBefore, navigate]);

  return null;
}

export default React.memo(Home);
