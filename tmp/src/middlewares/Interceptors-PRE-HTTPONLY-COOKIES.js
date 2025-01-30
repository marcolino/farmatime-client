import axios from "axios";
import LocalStorage from "../libs/LocalStorage";
import { setDisableLoaderGlobal } from "../providers/LoaderState";
import { i18n } from "../i18n";
import cfg from "../config";

// track whether the token is being refreshed
let isRefreshing = false;
let refreshSubscribers = [];

let isSignedOut = false; // global flag to track sign-out status, to avoid retring requests after sign-out
const abortControllers = new Map(); // define an abortControllers map

// storage functions
const getLocalAccessToken = () => {
  return LocalStorage.get("auth")?.user?.accessToken;
}

const setLocalAccessToken = (token) => {
  let auth;
  try {
    // get the current auth info
    auth = LocalStorage.get("auth");
    if (!auth) {
      const message = "Auth info not found!";
      console.error(message);
      throw new Error(message);
    }

    // create a deep copy of the auth object
    const updatedAuth = JSON.parse(JSON.stringify(auth));

    // update the token
    if (updatedAuth.user && typeof updatedAuth.user === "object") {
      updatedAuth.user.accessToken = token;
    } else {
      const message = `Invalid auth info structure: ${updatedAuth}`;
      console.error(message);
      throw new Error(message);
    }

    // set the updated auth info
    try {
      LocalStorage.set("auth", updatedAuth);
      console.log("token successfully updated");
      return true;
    } catch (error) {
      const message = `Failed to set auth info: ${error.toString()}`;
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
  return LocalStorage.get("auth")?.user?.refreshToken;
}

const clearLocalTokens = () => {
  //const currentAuth = LocalStorage.get("auth");
  LocalStorage.set("auth", {"user": false});
};

// create axios instance
const createInstance = () => {
  return axios.create({
    baseURL: `${cfg.siteUrl}/api`, // *** axios api url ***
    timeout: cfg.api.timeoutSeconds * 1000,
    headers: {
      "Content-Type": "application/json",
    }
  });
};

console.log(`baseUrl: ${cfg.siteUrl}/api`);

const instance = createInstance();
const instanceForRefresh = createInstance(true);

// add a request interceptor to append authentication token to request headers
instance.interceptors.request.use(
  config => {
    config.headers["Authorization"] = getLocalAccessToken();
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
      const versionNumber = cfg.api.version;
      if (typeof versionNumber !== "undefined") {
        config.headers["Accept-Version"] = versionNumber;
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
);

// add a request interceptor to append the current language to all requests
instance.interceptors.request.use(
  config => {
    const currentLanguage = i18n.language || i18n.options.fallbackLng[0]; // get the current language from i18n
    config.headers["Accept-Language"] = currentLanguage;
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
);

// add a request abort controller, to be able to abort requests, for example after signout
instance.interceptors.request.use(
  config => {
    const controller = new AbortController();
    config.signal = controller.signal;

    // track the controller for this request
    abortControllers.set(config.url, controller);
    return config;
  },
  error => Promise.reject(error)
);

// clean up abort controller after the request completes
instance.interceptors.response.use(
  response => {
    abortControllers.delete(response.config.url);
    return response;
  },
  error => {
    if (error.config) {
      abortControllers.delete(error.config.url);
    }
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

// response interceptor to refresh tokens
instance.interceptors.response.use(
  response => {
    // if (response.headers["maintenanceStatus"] === "true") {
    //   if (window.location.pathname !== "/work-in-progress") {
    //     LocalStorage.set("maintenanceStatus", "true"); // for client-side routing maintenance
    //     LocalStorage.set("maintenancePath", window.location.pathname); // for client-side routing maintenance
    //     window.location.href = "/work-in-progress";
    //   }
    // } else {
    //   LocalStorage.remove("maintenanceStatus");
    //   const maintenancePath = LocalStorage.get("maintenancePath");
    //   if (maintenancePath) { // maintenance path is set, we did just restore a not work-in-progress status
    //     window.location.href = maintenancePath;
    //     LocalStorage.remove("maintenancePath");
    //   }
    // }
    return response;
  },
  async (error) => {
    const { config, response } = error;
    if (!response) {
      return Promise.reject(new Error(i18n.t("No response from server!")));
    }
    if (response.status === 503) { // on maintenance
      if (window.location.pathname !== "/work-in-progress") {
        LocalStorage.set("maintenanceStatus", true); // for client-side routing maintenance
        LocalStorage.set("maintenancePath", window.location.pathname); // for client-side routing maintenance
        window.location.href = "/work-in-progress";
      }
    } else {
      LocalStorage.remove("maintenanceStatus");
      const maintenancePath = LocalStorage.get("maintenancePath");
      if (maintenancePath) { // maintenance path is set, we did just restore a not work-in-progress status
        window.location.href = maintenancePath;
        LocalStorage.remove("maintenancePath");
      }
    }
    if (response.status === 404) { // page not found
      if (config.url !== "/page-not-found") {
        if (window.location.pathname !== "/page-not-found") {
          window.location.href = "/page-not-found";
        }
      }
    }

    // if /auth/signin request arrives, we reset isSignedOut
    if (config.url === "/auth/signin") {
      isSignedOut = false;
      console.log("isSignedOut reset to false because /auth/signin was called");
    }

    // if the user has signed out, do not retry requests
    if (isSignedOut && config.url === "/auth/signout") {
      console.log("Request aborted because user is already signed out:", config.url);
      return Promise.reject(new Error("Signout request ingnored because user is already signed out"));
    }

    if (
      response.status === 401 &&
      config.url !== "/auth/signin" &&
      config.url !== "/auth/signup" &&
      config.url !== "/auth/signout" &&
      config.url !== "/auth/notificationVerification" &&
      config.url !== "/auth/notificationPreferencesSave" //&&
      //config.url !== "/payment/createCheckoutSession" // ???
    ) { // unauthorized
      if (!isRefreshing) {
        isRefreshing = true;
        try { // refresh expired access token
          const newAccessToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newAccessToken);
          refreshSubscribers = [];
          return instance(config);
        } catch (refreshError) { // could not refresh access token: user is logged out, redirect to signin page
          console.log("refreshError caught:", refreshError);
          isRefreshing = false;
          clearLocalTokens();
          setDisableLoaderGlobal(true); // to disable the loader before redirection
          setTimeout(() => { // redirect to signin page with some delay, to allow snackbar to be read
            setDisableLoaderGlobal(false); // to reenable the loader after redirection
            window.location.href = "/signin";
          }, cfg.ui.snacks.autoHideDurationSeconds * 1000);
          //refreshError.response.data.message = null; // avoid double error showing snackbar on component
          return Promise.reject(refreshError);
        }
      } else {
        // token refresh already in progress
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(token => {
            config.headers["Authorization"] = `Bearer ${token}`;
            resolve(instance(config));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export const cancelAllRequests = () => {
  isSignedOut = true; // mark the user as signed out
  abortControllers.forEach(controller => controller.abort());
  abortControllers.clear();
};

export default instance;
