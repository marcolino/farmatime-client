import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AnimationLayout from "./AnimationLayout";
import { getCurrentLanguage } from "../libs/I18n";
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
const EditProduct = lazy(() => import("./EditProduct"));
const Legal = lazy(() => import("./legal/legal"));
//const CookieConsent = lazy(() => import("./CookieConsent"));
import CookieConsent from "./CookieConsent"; // avoid bot dynamic and static import
const Contacts = lazy(() => import("./Contacts"));
const HandleUsers = lazy(() => import("./HandleUsers"));
const HandleProducts = lazy(() => import("./HandleProducts"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const WorkInProgress = lazy(() => import("./WorkInProgress"));

const Routing = () => {
  const { i18n } = useTranslation();

  return (
    <Suspense fallback={<Loader lazyloading={true} />}>
      <Routes>
        <Route element={<AnimationLayout />}>
          <Route path="/" exact element={<Home />} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="/signup" element={<SignUp />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/signin" element={<SignIn />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/social-signin-success" element={<SocialSignInSuccess />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/social-signin-error" element={<SocialSignInError />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/products" element={<Products />} /> {/* sitemapFrequency={"daily"} sitemapPriority={1.0} */}
          <Route path="/notifications" element={<Notifications />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.2} */}
          <Route path="/edit-user/:userId/:origin" element={<EditUser />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.2} */}
          <Route path="/edit-product/:productId" element={<EditProduct />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.2} */}
          <Route path="/terms-of-use" element={<Legal language={getCurrentLanguage(i18n)} doc="termsOfUse" />} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="/privacy-policy" element={<Legal language={getCurrentLanguage(i18n)} doc="privacyPolicy" />} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="/cookie-consent" element={<CookieConsent />} /> {/* sitemapFrequency={"monthly"} sitemapPriority={0.3} */}
          <Route path="/contacts" element={<Contacts />} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="/handle-users" element={<HandleUsers />} /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
          <Route path="/handle-products" element={<HandleProducts />} /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
          <Route path="/page-not-found" element={<PageNotFound />} /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
          <Route path="/work-in-progress" element={<WorkInProgress />} /> {/* sitemapFrequency={"yearly"} sitemapPriority={0} */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default React.memo(Routing);
{/* <Route path="/terms-of-use" render={(props) => <Legal language={getCurrentLanguage(i18n)} doc={"termsOfUse"} /> } /> {/* sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
{/* <Route path="/privacy-policy" render={(props) => <Legal language={getCurrentLanguage(i18n)} doc={"privacyPolicy"} />} /> sitemapFrequency={"weekly"} sitemapPriority={0.7} */}
