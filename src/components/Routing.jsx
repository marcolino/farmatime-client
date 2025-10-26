import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AnimationLayout from "./AnimationLayout";
import Loader from "./Loader";
// import { RequireAuth as ReqAuth } from "./guards/AuthGuard";
// import { RequireAdmin as ReqAdmin } from "./guards/RoleGuard";
import ProtectedRoute from "./RoutingProtection";
//import config from "../config";

const Home = lazy(() => import("./Home"));
const SignUp = lazy(() => import("./auth/SignUp")); 
const SignIn = lazy(() => import("./auth/SignIn"));
const SocialSignInSuccess = lazy(() => import("./auth/SocialSignInSuccess"));
const SocialSignInError = lazy(() => import("./auth/SocialSignInError"));
const SocialRevoke = lazy(() => import("./auth/SocialRevoke"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const Products = lazy(() => import("./Products"));
const Notifications = lazy(() => import("./Notifications"));
const UserEdit = lazy(() => import("./UserEdit"));
const ProductEdit = lazy(() => import("./ProductEdit"));
const Legal = lazy(() => import("./legal/legal"));
import PreferencesCookie from "./PreferencesCookie"; // avoid both dynamic and static import
const Contacts = lazy(() => import("./Contacts"));
const UsersHandle = lazy(() => import("./UsersHandle"));
const ProductsHandle = lazy(() => import("./ProductsHandle"));
const Cart = lazy(() => import("./Cart"));
const PreferencesNotification = lazy(() => import("./PreferencesNotification"));
const AdvancedOptions = lazy(() => import("./AdvancedOptions"));
const JobsHandle = lazy(() => import("./JobsHandle"));
// const JobsExport = lazy(() => import("./JobsExport"));
// const JobsImport = lazy(() => import("./JobsImport"));
const JobEmailTemplate = lazy(() => import("./JobEmailTemplate"));
const JobsRemove = lazy(() => import("./JobsRemove"));
const JobFlow = lazy(() => import("./JobFlow"));
//const DataRemoval = lazy(() => import("./DataRemoval"));
const RequestsHistoryHandle = lazy(() => import("./RequestsHistoryHandle"));
const RequestsScheduledHandle = lazy(() => import("./RequestsScheduledHandle"));
const Landing = lazy(() => import("./Landing"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const WorkInProgress = lazy(() => import("./WorkInProgress"));
const ToBeDone = lazy(() => import("./ToBeDone"));

//const jobsExport = () => <div>Export Page</div>;

const Routing = () => {
  return (
    <Suspense fallback={<Loader lazyloading={true} />}>
      <Routes>
        <Route element={<AnimationLayout />}>
          {/* Public routes */}
          <Route path="/landing" element={<Landing />} sitemapPath="/landing" />
          <Route path="/" exact element={<Home />} sitemapPath="/" />
          <Route path="/signup/:waitingForCode?/:codeDeliveryMedium?" element={<SignUp />} sitemapPath="/signup" />
          <Route path="/signin" element={<SignIn />} sitemapPath="/signin" />
          <Route path="/social-signin-success" element={<SocialSignInSuccess />} sitemapPath="social-signin-success" />
          <Route path="/social-signin-error" element={<SocialSignInError />} sitemapPath="social-signin-error" />
          <Route path="/social-revoke" element={<SocialRevoke />} sitemapPath="social-revoke" />
          <Route path="/forgot-password" element={<ForgotPassword />} sitemapPath="forgot-password" />
          <Route path="/terms-of-use" element={<Legal doc="termsOfUse" />} sitemapPath="terms-of-use" />
          <Route path="/privacy-policy" element={<Legal doc="privacyPolicy" />} sitemapPath="privacy-policy" />
          <Route path="/cookie-preferences" element={<PreferencesCookie />} sitemapPath="cookie-preferences" />
          {/* <DISABLED Route path="/data-removal" element={<DataRemoval />} sitemapPath="data-removal" /> */}
          <Route path="/contacts" element={<Contacts />} sitemapPath="contacts" />
          <Route path="/payment-success" element={<Cart payment="success" />} sitemapPath="payment-success" />
          <Route path="/payment-cancel" element={<Cart payment="cancel" />} sitemapPath="payment-cancel" />

          {/* Public routes, with internal logic for protection */}
          <Route path="/edit-user/:userId/:origin" element={<UserEdit />} />
          <Route path="/products/:productId?" element={<Products />} />

          {/* Protected routes (accept only logged users, any role) */}
          <Route element={<ProtectedRoute acceptGuest={false} acceptedRoles={"TUTTI"} />}>
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/edit-product/:productId" element={<ProductEdit />} />
            <Route path="/handle-users" element={<UsersHandle />} />
            <Route path="/handle-products" element={<ProductsHandle />} />
            <Route path="/cart/" element={<Cart />} />
            <Route path="/notification-preferences/:token?/:language?" element={<PreferencesNotification section="all" />} />
            <Route path="/email-preferences/:token?/:language?" element={<PreferencesNotification section="email" action="preferences" />} />
            <Route path="/email-unsubscribe/:token?/:language?" element={<PreferencesNotification section="email" action="unsubscribe" />} />
            <Route path="/push-preferences/:token?/:language?" element={<PreferencesNotification section="push" action="preferences" />} />
            <Route path="/push-unsubscribe/:token?/:language?" element={<PreferencesNotification section="push" action="unsubscribe" />} />
            <Route path="/sms-preferences/:token?/:language?" element={<PreferencesNotification section="sms" action="preferences" />} />
            <Route path="/sms-unsubscribe/:token?/:language?" element={<PreferencesNotification section="sms" action="unsubscribe" />} />
            <Route path="/advanced-options" element={<AdvancedOptions />} />
            <Route path="/jobs-handle" element={<JobsHandle />} />
            <Route path="/job/:jobId" element={<JobFlow />} />
            {/* <DISABLED Route path="/job/new" element={<JobFlow />} /> */}
            <Route path="/job-email-template-edit" element={<JobEmailTemplate /* onCompleted={(data) => alert("COMPLETED:" + JSON.stringify(data))} */ />} />
            {/* <DISABLED Route path="/job-data-export" element={<JobsExport />} /> */}
            {/* <DISABLED Route path="/job-data-import" element={<JobsImport onDataImported={ (data) => alert(JSON.stringify(data)) }/>} /> */}
            <Route path="/job-data-remove" element={<JobsRemove />} />
            <Route path="/fish" element={<ToBeDone />} /> {/* TODO: REMOVEME */}
            <Route path="/requests-history" element={<RequestsHistoryHandle />} />
            <Route path="/requests-scheduled" element={<RequestsScheduledHandle />} />
            <Route path="/todo" element={<ToBeDone />} />{/* just to show the fish! */}
          </Route>

          {/* Fallback routes */}
          <Route path="/page-not-found" element={<PageNotFound />} sitemapPath="/page-not-found" />
          <Route path="/work-in-progress" element={<WorkInProgress />} sitemapPath="/work-in-progress" />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default React.memo(Routing);
