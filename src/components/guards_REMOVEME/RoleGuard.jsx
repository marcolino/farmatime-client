// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../../providers/AuthContext";
// import { useSnackbarContext } from "../../providers/SnackbarProvider";
// import { isAdmin } from "../../libs/Validation";

const RequireAdmin = ({ children }) => {
  // const { auth } = useContext(AuthContext);
  // const { showSnackbar } = useSnackbarContext();

  // if (!auth.user || !isAdmin(auth.user)) {
  //   showSnackbar("You must have admin role to access this page", "warning");
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export { RequireAdmin };
