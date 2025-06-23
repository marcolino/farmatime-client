import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
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
const JobDataExport = lazy(() => import("./JobDataExport"));
const JobDataImport = lazy(() => import("./JobDataImport"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const WorkInProgress = lazy(() => import("./WorkInProgress"));

//const JobDataExport = () => <div>Export Page</div>;

const Routing = () => {
  return (
    <Suspense fallback={<Loader lazyloading={true} />}>
      <Routes>
        <Route element={<AnimationLayout />}>
          <Route path="/" exact element={<Home />} />
          {/* TODO: for signup: instead of this static routing, use
                const location = useLocation();
              and
                const state = location.state;
          */}
          <Route path="/signup/:waitingForCode?/:codeDeliveryMedium?" element={<SignUp />} />
          {/* <Route path="/signin/:redirectTo?/:redirectToParams?" element={<SignIn />} /> */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/social-signin-success" element={<SocialSignInSuccess />} />
          <Route path="/social-signin-error" element={<SocialSignInError />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/products/:productId?" element={<Products />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/edit-user/:userId/:origin" element={<UserEdit />} />
          <Route path="/edit-product/:productId" element={<ProductEdit />} />
          <Route path="/terms-of-use" element={<Legal doc="termsOfUse" />} />
          <Route path="/privacy-policy" element={<Legal doc="privacyPolicy" />} />
          <Route path="/cookie-preferences" element={<CookiePreferences />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/handle-users" element={<UsersHandle />} />
          <Route path="/handle-products" element={<ProductsHandle />} />
          {/* <Route path="/cart/:productIdToAdd?" element={<Cart />} /> */}
          <Route path="/cart/" element={<Cart />} />
          <Route path="/payment-success" element={<Cart payment="success" />} />
          <Route path="/payment-cancel" element={<Cart payment="cancel" />} />
          {/* TODO: for the folloging routes: instead of this static routing, use
                const location = useLocation();
              and
                const state = location.state;
            */}
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
          <Route path="/advanced-options" element={<AdvancedOptions />} />
          <Route path="/job-data-export" element={<JobDataExport />} />
          <Route path="/job-data-import" element={<JobDataImport onDataImported={ (data) => alert(JSON.stringify(data)) }/>} />
          {/* <Route path="/api/*" element={null} /> */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default React.memo(Routing);
