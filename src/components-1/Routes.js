import React, { useEffect, Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom"; // TODO: Ok? if so, accorpate with next row
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../libs/I18n";
import { toast } from "./Toast";
// import Spinner from "./Spinner";
import Loader from "./Loader";
//import Profile from "./auth/Profile";

const Home = lazy(() => import("./Home"));
const SignUp = lazy(() => import("./auth/SignUp")); 
const SignIn = lazy(() => import("./auth/SignIn"));
const SignOut = lazy(() => import("./auth/SignOut"));
const Profile = lazy(() => import("./auth/Profile"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const Searches = lazy(() => import("./Searches"));
const Products = lazy(() => import("./Products"));
const Notifications = lazy(() => import("./Notifications"));
const EditUser = lazy(() => import("./EditUser"));
const Legal = lazy(() => import("./legal/legal"));
const Contacts = lazy(() => import("./Contacts"));
const AdminPanel = lazy(() => import("./AdminPanel"));
const HandleUsers = lazy(() => import("./HandleUsers"));
const HandleProducts = lazy(() => import("./HandleProducts"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const WorkInProgress = lazy(() => import("./WorkInProgress"));



function Routes() {
  const location = useLocation();
  const { i18n } = useTranslation();

  // check for error parameters in location url
  useEffect(() => {
    const search = queryString.parse(location.search);
    if (search.error) {
      toast.warning(`Social login did not work, sorry.\n${search.error}: ${search.error_description}`);
    }
  }, [location]);

  return (
    <Suspense> {/* TODO: <Suspense fallback={<Loader />}> gives an error: "TypeError: Cannot read properties of undefined (reading 'refs')" */}
      <div style={styles.content}>
        <Switch location={location}>
          <Route path="/" exact component={Home} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="/signup" component={SignUp} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/signin" component={SignIn} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/profile" component={Profile} />
          <Route path="/signout" component={SignOut} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/searches" component={Searches} /> {/* sitemapFrequency={"daily"} sitemapPriority={1.0} */}
          <Route path="/products" component={Products} /> {/* sitemapFrequency={"daily"} sitemapPriority={1.0} */}
          <Route path="/notifications" component={Notifications} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.2} */}
          <Route path="/edit-user/:userId" component={EditUser} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.2} */}
          <Route path="/terms-of-use" render={(props) => <Legal language={getCurrentLanguage(i18n)} doc={"termsOfUse"} /> } />
          <Route path="/privacy-policy" render={(props) => <Legal language={getCurrentLanguage(i18n)} doc={"privacyPolicy"} />} />
          <Route path="/contacts" component={Contacts} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="/admin-panel" component={AdminPanel} /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
          <Route path="/handle-users" component={HandleUsers} /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
          <Route path="/handle-products" component={WorkInProgress/*HandleProducts*/} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="" component={PageNotFound} />
        </Switch>
      </div>
    </Suspense>
  );
}

// TODO: are the following styles used?
const styles = {};

styles["fade-enter"] = {
  opacity: 0,
  zIndex: 1,
};

styles["fade-enter"] = {
  opacity: 0,
  transition: "opacity 250ms ease-in",
};

styles["fade-enter-active"] = {
  opacity: 1,
  transition: "opacity 250ms ease-in",
};

// styles.fill = {
//   position: "absolute",
//   left: 0,
//   right: 0,
//   top: 100,
//   bottom: 0
// };

// styles.content = {
//   ...styles.fill,
//   top: "140px",
//   textAlign: "center"
// };

export default React.memo(Routes);