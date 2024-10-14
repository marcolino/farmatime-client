import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../libs/I18n";
import { useSnackbar }  from "../providers/SnackbarManager";
import PageTransition from "./PageTransition";
import Loader from "./Loader";


const Home = lazy(() => import("./Home"));
const SignUp = lazy(() => import("./auth/SignUp")); 
const SignIn = lazy(() => import("./auth/SignIn"));
const SocialSignInSuccess = lazy(() => import("./auth/SocialSignInSuccess"));
const SocialSignInError = lazy(() => import("./auth/SocialSignInError"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const Products = lazy(() => import("./Products"));
const Notifications = lazy(() => import("./Notifications"));
const EditUser = lazy(() => import("./EditUser"));
const Legal = lazy(() => import("./legal/legal"));
const Contacts = lazy(() => import("./Contacts"));
const HandleUsers = lazy(() => import("./HandleUsers"));
const HandleProducts = lazy(() => import("./HandleProducts"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const WorkInProgress = lazy(() => import("./WorkInProgress"));

function Routing() {
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const { i18n } = useTranslation();

  // check for error parameters in location url
  useEffect(() => {
    const search = queryString.parse(location.search);
    if (search.error) {
      showSnackbar(i18n.t("Social login did not work, sorry.\n{{error}}: {{errorDescription}}", { error: search.error, errorDescription: search.error_description }));
    }
  }, [location]);

  return (
    <PageTransition>
      <Suspense fallback={<Loader lazyloading={true} />}>
        <Routes>
          <Route path="/" exact element={<Home />} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="/signup" element={<SignUp />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/signin" element={<SignIn />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/social-signin-success" element={<SocialSignInSuccess />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/social-signin-error" element={<SocialSignInError />} />c
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/products" element={<Products />} /> {/* sitemapFrequency={"daily"} sitemapPriority={1.0} */}
          <Route path="/notifications" element={<Notifications />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.2} */}
          <Route path="/edit-user/:userId/:origin" element={<EditUser />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.2} */}
          <Route path="/terms-of-use" render={(props) => <Legal language={getCurrentLanguage(i18n)} doc={"termsOfUse"} /> } />
          <Route path="/privacy-policy" render={(props) => <Legal language={getCurrentLanguage(i18n)} doc={"privacyPolicy"} />} />
          <Route path="/contacts" element={<Contacts />} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="/handle-users" element={<HandleUsers />} /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
          <Route path="/handle-products" element={<HandleProducts />} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="/page-not-found" element={<PageNotFound />} /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
          <Route path="/work-in-progress" element={<WorkInProgress />} /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </PageTransition>
);
}

export default React.memo(Routing);