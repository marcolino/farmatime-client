import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
//import { useTranslation } from "react-i18next";
import AnimationLayout from "./AnimationLayout";
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
import CookieConsent from "./CookieConsent"; // avoid both dynamic and static import
const Contacts = lazy(() => import("./Contacts"));
const HandleUsers = lazy(() => import("./HandleUsers"));
const HandleProducts = lazy(() => import("./HandleProducts"));
const NotificationPreferences = lazy(() => import("./NotificationPreferences"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const WorkInProgress = lazy(() => import("./WorkInProgress"));

const Routing = () => {
  //const { i18n } = useTranslation();
  return (
    <Suspense fallback={<Loader lazyloading={true} />}>
      <Routes>
        <Route element={<AnimationLayout />}>
          <Route path="/" exact element={<Home />} />
          <Route path="/signup/:waitingForCode?/:codeDeliveryMedium?" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/social-signin-success" element={<SocialSignInSuccess />} />
          <Route path="/social-signin-error" element={<SocialSignInError />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/products" element={<Products />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/edit-user/:userId/:origin" element={<EditUser />} />
          <Route path="/edit-product/:productId" element={<EditProduct />} />
          <Route path="/terms-of-use" element={<Legal doc="termsOfUse" />} />
          <Route path="/privacy-policy" element={<Legal doc="privacyPolicy" />} />
          <Route path="/cookie-consent" element={<CookieConsent />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/handle-users" element={<HandleUsers />} />
          <Route path="/handle-products" element={<HandleProducts />} />
          <Route path="/notification-preferences/:token?/:language?" element={<NotificationPreferences section="all" />} />
          <Route path="/email-preferences/:token?/:language?" element={<NotificationPreferences section="email" action="preferences" />} />
          <Route path="/email-unsubscribe/:token?/:language?" element={<NotificationPreferences section="email" action="unsubscribe" />} />
          <Route path="/push-preferences/:token?/:language?" element={<NotificationPreferences section="push" action="preferences" />} />
          <Route path="/push-unsubscribe/:token?/:language?" element={<NotificationPreferences section="push" action="unsubscribe" />} />
          <Route path="/sms-preferences/:token?/:language?" element={<NotificationPreferences section="sms" action="preferences" />} />
          <Route path="/sms-unsubscribe/:token?/:language?" element={<NotificationPreferences section="sms" action="unsubscribe" />} />
          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="/work-in-progress" element={<WorkInProgress />} />
          <Route path="/email-preferences" element={<NotificationPreferences section="email" action="preferences" />} />
          {/* <Route path="/api/*" element={null} /> */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default React.memo(Routing);
