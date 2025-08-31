//import React from "react";
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../providers/AuthContext';

const ProtectedRoute = ({ acceptGuest, acceptedRoles = "*", redirectPath = "/signin" }) => {
  const { auth, isLoggedIn } = useContext(AuthContext);

  if (!acceptGuest) {
    if (!isLoggedIn) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  if (acceptedRoles && acceptedRoles !== "*" && acceptedRoles.length) {
    // acceptedRoles === "*" (which is by default) accepts any role
    if (!isLoggedIn) { // if not logged in, no roles for this user, so redirect
      return <Navigate to={redirectPath} replace />;
    }
    console.log("************ auth.user.roles:", auth.user.roles);
     
    if (acceptedRoles.includes(auth.user.roles)) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <Outlet />; // renders children routes
};

export default ProtectedRoute;
