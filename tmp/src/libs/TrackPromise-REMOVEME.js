//import React from "react";
//import { Auth } from "aws-amplify";
import { trackPromise } from "react-promise-tracker";
import Auth from "./Auth";



export function NOTUSEDcurrentAuthenticatedUser({success, error, final}) {
  trackPromise(
    Auth.NOTUSEDcurrentAuthenticatedUser()
      .then((data) => success(data))
      .catch((data) => error(data))
      .finally((data) => final(data))
   );
}

export function signIn(props, {success, error, final}) {
  trackPromise(
    Auth.signIn({...props})
      .then((data) => {console.log("success:", data); success(data)})
      .catch((data) => {console.log("error:", data); error(data)})
      .finally((data) => final(data))
  );
}

export function federatedSignIn(props, {success, error, final}) {
  trackPromise(
    Auth.federatedSignIn({...props})
      .then((data) => success(data))
      .catch((data) => error(data))
      .finally((data) => final(data))
  );
}
  
export function signUp(props, {success, error, final}) {
  trackPromise(
    Auth.signUp({...props})
      .then((data) => success(data))
      .catch((data) => error(data))
      .finally((data) => final(data))
  );
};

//export function signupVerification(username, code, {success, error, final}) {
export function signupVerification(props, {success, error, final}) {
console.log('TrackPromise - props:', props);
  trackPromise(
    Auth.signupVerification({...props})
      .then((data) => success(data))
      .catch((data) => error(data))
      .finally((data) => final(data))
  );
};

export function forgotPassword(username, {success, error, final}) {
  trackPromise(
    Auth.forgotPassword(username)
      .then((data) => success(data))
      .catch((data) => error(data))
      .finally((data) => final(data))
  );
};

export function resendSignup(username, {success, error, final}) {
  trackPromise(
    Auth.resendSignup(username)
      .then((data) => success(data))
      .catch((data) => error(data))
      .finally((data) => final(data))
  );
};

export function forgotPasswordSubmit(username, code, password, {success, error, final}) {
  trackPromise(
    Auth.forgotPasswordSubmit(username, code, password,)
      .then((data) => success(data))
      .catch((data) => error(data))
      .finally((data) => final(data))
  );
};

export function resendResetPasswordCode(username, {success, error, final}) {
  trackPromise(
    //Auth.resendResetPassword(username)
    Auth.resendSignup(username)
      .then((data) => success(data))
      .catch((data) => error(data))
      .finally((data) => final(data))
  );
};

export function signOut({success, error, final}) {
  trackPromise(
    Auth.signOut()
      .then((data) => success(data))
      .catch((data) => error(data))
      .finally((data) => final(data))
  );
};
