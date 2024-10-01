import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider"; // assuming useAuth is defined
import { useSnackbar } from "../../providers/SnackbarManager";
import { useTranslation } from "react-i18next";

function SignOut() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut();
      showSnackbar(t("sign out successful"), "success");
      navigate("/", { replace: true });
    };

    handleSignOut();
  }, [signOut, navigate, showSnackbar, t]);

  return null;
}

export default SignOut;
