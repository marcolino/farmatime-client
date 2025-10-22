import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiCall } from "../../libs/Network";
import { useDialog } from "../../providers/DialogContext";
import { useSnackbarContext } from "../../providers/SnackbarProvider"; 
//import { AuthContext } from "../../providers/AuthContext";


function SocialSignInSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbarContext();
  const { showDialog } = useDialog();
  
  const params = new URLSearchParams(location.search);
  const stringifiedData = params.get("data");
  const [user] = useState(JSON.parse(stringifiedData));

  useEffect(() => {
    if (!user) {
      console.error("*** SocialRevoke error: no user!");
      showDialog({
        title: t("Social revoke error"),
        message: t("No user found"),
        confirmText: t("Ok"),
        onConfirm: () => {
          navigate("/", { replace: true });
        },
      });
      //navigate("/social-signin-error", { replace: true }); // redirect to home route
      return;
    }
    console.log("user:", user);
    if (!user.socialId) {
      console.error("*** SocialRevoke error: no socialId for user!");
      showDialog({
        title: t("Social revoke error"),
        message: t("No socialId for user"),
        confirmText: t("Ok"),
        onConfirm: () => {
          navigate("/", { replace: true });
        },
      });
      return;
    }
    const provider = user.socialId.split(":")[0];
    showDialog({
      title: t("Social revoke"),
      message: t("Are you sure you want to revoke the access to your {{provider}} social account for this app?", { provider }),
      confirmText: t("Yes, revoke"),
      cancelText: t("No, keep access"),
      onConfirm: async () => {
        // Call the API to revoke social access
        const result = await apiCall("post", `/auth/${provider}/revoke`, {
          userId: user.id,
          provider,
          issuedAt: null
        });
        console.log("*** revokeSocialAccess result:", result);
        showSnackbar(t("{{provider} social access revoked", { provider }), "success");
        navigate("/", { replace: true });
      },
    });
    navigate("/", { replace: true }); // redirect to home route
  }, [user, navigate]);
}

export default React.memo(SocialSignInSuccess);
