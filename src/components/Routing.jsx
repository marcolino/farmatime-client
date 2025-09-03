import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AnimationLayout from "./AnimationLayout";
import Loader from "./Loader";
// import { RequireAuth as ReqAuth } from "./guards/AuthGuard";
// import { RequireAdmin as ReqAdmin } from "./guards/RoleGuard";
import ProtectedRoute from "./RoutingProtection";

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
import CookiePreferences from "./CookiePreferences"; // avoid both dynamic and static import
const Contacts = lazy(() => import("./Contacts"));
const UsersHandle = lazy(() => import("./UsersHandle"));
const ProductsHandle = lazy(() => import("./ProductsHandle"));
const Cart = lazy(() => import("./Cart"));
const NotificationPreferences = lazy(() => import("./NotificationPreferences"));
const AdvancedOptions = lazy(() => import("./AdvancedOptions"));
const JobsHandle = lazy(() => import("./JobsHandle"));
// const JobsExport = lazy(() => import("./JobsExport"));
// const JobsImport = lazy(() => import("./JobsImport"));
const JobsEmailTemplateEdit = lazy(() => import("./JobEmailTemplate"));
const JobsRemove = lazy(() => import("./JobsRemove"));
const JobFlow = lazy(() => import("./JobFlow"));
const DataRemoval = lazy(() => import("./DataRemoval"));
const Landing = lazy(() => import("./Landing"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const WorkInProgress = lazy(() => import("./WorkInProgress"));

//const jobsExport = () => <div>Export Page</div>;

const Routing = () => {
  return (
    <Suspense fallback={<Loader lazyloading={true} />}>
      <Routes>
        <Route element={<AnimationLayout />}>
          {/* Public routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/" exact element={<Home />} />
          <Route path="/signup/:waitingForCode?/:codeDeliveryMedium?" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/social-signin-success" element={<SocialSignInSuccess />} />
          <Route path="/social-signin-error" element={<SocialSignInError />} />
          <Route path="/social-revoke" element={<SocialRevoke />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms-of-use" element={<Legal doc="termsOfUse" />} />
          <Route path="/privacy-policy" element={<Legal doc="privacyPolicy" />} />
          <Route path="/cookie-preferences" element={<CookiePreferences />} />
          <Route path="/data-removal" element={<DataRemoval />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/payment-success" element={<Cart payment="success" />} />
          <Route path="/payment-cancel" element={<Cart payment="cancel" />} />

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
            <Route path="/notification-preferences/:token?/:language?" element={<NotificationPreferences section="all" />} />
            <Route path="/email-preferences/:token?/:language?" element={<NotificationPreferences section="email" action="preferences" />} />
            <Route path="/email-unsubscribe/:token?/:language?" element={<NotificationPreferences section="email" action="unsubscribe" />} />
            <Route path="/push-preferences/:token?/:language?" element={<NotificationPreferences section="push" action="preferences" />} />
            <Route path="/push-unsubscribe/:token?/:language?" element={<NotificationPreferences section="push" action="unsubscribe" />} />
            <Route path="/sms-preferences/:token?/:language?" element={<NotificationPreferences section="sms" action="preferences" />} />
            <Route path="/sms-unsubscribe/:token?/:language?" element={<NotificationPreferences section="sms" action="unsubscribe" />} />
            <Route path="/advanced-options" element={<AdvancedOptions />} />
            <Route path="/jobs-handle" element={<JobsHandle />} />
            <Route path="/job" element={<JobFlow />} />
            <Route path="/job-new" element={<JobFlow />} />
            <Route path="/job-email-template-edit" element={<JobsEmailTemplateEdit /* onCompleted={(data) => alert("COMPLETED:" + JSON.stringify(data))} */ />} />
            {/* <Route path="/job-data-export" element={<JobsExport />} /> */}
            {/* <Route path="/job-data-import" element={<JobsImport onDataImported={ (data) => alert(JSON.stringify(data)) }/>} /> */}
            <Route path="/job-data-remove" element={<JobsRemove />} /> { /* TODO: remove me, do all in dialog... */ }
          </Route>

          {/* Fallback routes */}
          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="/work-in-progress" element={<WorkInProgress />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default React.memo(Routing);
