import instance from "../middlewares/Interceptors";

export const signIn = (params) => {
  return instance.post("/auth/signin", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    //return { ok: false, ...err.response.data };
    console.log('Full error object:', err);
    if (err.response) {
      console.log('Error response:', err.response);
      return { ok: false, ...err.response.data };
    } else if (err.request) {
      console.log('No response received:', err.request);
      return { ok: false, message: "No response from server. Please check your connection." };
    } else {
      console.log('Other error:', err.message);
      return { ok: false, message: err.message };
    }
  });
};

export const getUser = (params) => {
  console.log("getUser = (params):", params);
  return instance.get("/user/getUser", { params }).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    console.log("0 getUser ERROR, err:", err, JSON.stringify(err));
    if (err?.response?.data?.error) {
      console.log("1 getUser ERROR, err:", JSON.stringify(err.response.data.error), typeof err.response.data.error);
      return { ok: false, message: err.response.data.error };
    } else {
      console.log("2 getUser ERROR, err:", JSON.stringify(err));
      return { ok: false, ...err.response.data };
    }
  });
};

export const getUsers = (params) => { // TODO: call me getAllUsersWithFullInfo
  return instance.get("/user/getAllUsersWithFullInfo", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};

export const getAllPlans = (params) => {
  return instance.get("/user/getAllPlans", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};

export const getAllRoles = (params) => {
  return instance.get("/user/getAllRoles", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};

export const removeUser = (params) => {
  console.log("removeUser = (params):", params);
  return instance.post("/user/removeUser", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};

export const updateUser = (params) => {
  console.log("updateUser = (params):", params);
  return instance.post("/user/updateUser", params).then(response => {
    console.log("updateUser SUCCESS, response:", response);
    return { ok: true, ...response.data };
  }).catch(err => {
    console.log("0 updateUser ERROR, err:", err, JSON.stringify(err));
    if (err?.response?.data?.error) {
      console.log("1 updateUser ERROR, err:", JSON.stringify(err.response.data.error), typeof err.response.data.error);
      return { ok: false, message: err.response.data.error };
    } else {
      console.log("2 updateUser ERROR, err:", JSON.stringify(err));
      return { ok: false, ...err.response.data };
    }
  });
};

export const forgotPassword = (params) => {
  return instance.post("/auth/resetPassword", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};

export const forgotPasswordSubmit = (params) => {
  return instance.post("/auth/resetPasswordConfirm", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};

export const resendResetPasswordCode = (params) => {
  return instance.post("/auth/resend", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};

export const refreshToken = (params) => {
  return instance.post("/auth/refreshtoken", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    console.error("Error refreshing token:", err); // TODO...
    return { ok: false, ...err.response.data };
  });
};

export const sendEmailToUsers = (params) => {
  return instance.post("/user/sendEmailToUsers", params).then(response => {
    return { ok: true, ...response.data };
  }).catch(err => {
    return { ok: false, ...err.response.data };
  });
};
