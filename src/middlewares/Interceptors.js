import axios from "axios";
import Cookie from "../libs/Cookie";
//import { useRedirect } from "../providers/RedirectProvider";
import { setDisableLoaderGlobal } from "../providers/LoaderState";

import { showGlobalSnackbar } from "../providers/SnackbarManager";
import cfg from "../config";

//const { setIsRedirecting } = useRedirect();

// track whether the token is being refreshed
let isRefreshing = false;
let refreshSubscribers = [];

// storage functions
const getLocalAccessToken = () => {
  return Cookie.get("auth")?.user?.accessToken;
}

const setLocalAccessToken = (token) => {
  let auth;
  try {
    // get the current auth cookie
    auth = Cookie.get("auth");
    if (!auth) {
      const message = "Auth cookie not found!";
      console.error(message);
      throw new Error(message);
    }

    // create a deep copy of the auth object
    const updatedAuth = JSON.parse(JSON.stringify(auth));

    // update the token
    if (updatedAuth.user && typeof updatedAuth.user === "object") {
      updatedAuth.user.accessToken = token;
    } else {
      const message = `Invalid auth cookie structure: ${updatedAuth}`;
      console.error(message);
      throw new Error(message);
    }

    // set the updated auth cookie
    try {
      Cookie.set("auth", JSON.stringify(updatedAuth));
      //Cookie.set("auth", updatedAuth);
      console.log("token successfully updated");
      return true;
    } catch (error) {
      const message = `Failed to set auth cookie: ${error.toString()}`;
      console.error(message);
      throw new Error(message);
    }
  } catch (error) {
    const message = `Error updating auth token: ${error.toString()}`;
    console.error(message);
    throw new Error(message);
  }
}

const getLocalRefreshToken = () => {
  return Cookie.get("auth")?.user?.refreshToken;
}

const clearLocalTokens = () => {
  const currentAuth = Cookie.get("auth");
  Cookie.set("auth", { ...currentAuth, "user": false });
};

// create axios instance
const createInstance = () => {
  return axios.create({
    baseURL: `${cfg.siteUrl}/api`,
    timeout: cfg.api.timeoutSeconds * 1000,
    headers: {
      "Content-Type": "application/json",
    }
  });
};

const instance = createInstance();
const instanceForRefresh = createInstance(true);

// add a request interceptor to append authentication token to request headers
instance.interceptors.request.use(
  config => {
    config.headers["Authorization"] = getLocalAccessToken();
    //console.log("instance.interceptors.request.use config:", config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// log requests and responses, only while developing
cfg.mode.development && instance.interceptors.request.use(
  config => {
    //console.log("interceptor request config:", config);
    return config;
  },
  error => {
    console.log("interceptor request error:", error);
    return Promise.reject(error);
  }
);

// add a request interceptor to append the version number to every request url
instance.interceptors.request.use(
  config => {
    if (typeof config.headers["Accept-Version"] === "undefined") { // if set already, keep it as-is, otherwise use default
      const versionNumber = import.meta.env.VITE_API_VERSION;
      if (typeof versionNumber !== "undefined") {
        config.headers["Accept-Version"] = versionNumber;
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
);

// add a subscriber to the list
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

// on token refreshed
function onRefreshed(token) {
  refreshSubscribers.map(cb => cb(token));
}

// refresh access token function
const refreshAccessToken = async () => {
  try {
    const token = getLocalRefreshToken();
    const response = await instanceForRefresh.post("/auth/refreshtoken", { token });
    setLocalAccessToken(response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    clearLocalTokens(); // clear tokens if refresh fails
    throw error;
  }
};

// response interceptor
instance.interceptors.response.use(
  response => {
    return response;
  },
  async (error) => {
    const { config, response } = error;
    if (!response) {
      return Promise.reject(new Error("No response from server!"));
    }
    if (response.status === 404) {
      window.location.href = "/page-not-found";
    }
    if (response.status === 401 && config.url !== "/auth/signin") {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newAccessToken);
          refreshSubscribers = [];
          return instance(config);
        } catch (refreshError) {
          console.log("refreshError caught:", refreshError);
          isRefreshing = false;
          clearLocalTokens();
          showGlobalSnackbar(refreshError.response.data.message, "warning");
          setDisableLoaderGlobal(true); // to disable the loader before redirection
          setTimeout(() => { // redirect to signin page with some delay, to allow snackbar to be read
            setDisableLoaderGlobal(false); // to reenable the loader after redirection
            /////////////////////////////////////window.location.href = "/signin";
          }, cfg.ui.snacks.autoHideDurationSeconds * 1000);
          refreshError.response.data.message = null; // avoid double error showing snackbar on component (TODO: check what happens removing this line...)
          return Promise.reject(refreshError);
        }
      } else {
        // token refresh already in progress
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(token => {
            //config.headers["Authorization"] = token;
            config.headers["Authorization"] = `Bearer ${token}`;
            resolve(instance(config));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
