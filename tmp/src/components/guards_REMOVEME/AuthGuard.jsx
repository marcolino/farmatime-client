// import { useContext, useEffect } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../../providers/AuthContext";
// import { useSnackbarContext } from "../../providers/SnackbarProvider";

const RequireAuth = ({ children }) => {
  // const { isLoggedIn } = useContext(AuthContext);
  // const { showSnackbar } = useSnackbarContext();
  // const location = useLocation();

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     showSnackbar("You must be logged in to access this page", "warning");
  //   }
  // }, [isLoggedIn, showSnackbar]);

  // if (!isLoggedIn) {
  //   return <Navigate to="/signin" state={{ from: location }} replace />;
  // }

  return children;
};

export { RequireAuth };
