import axios from "axios";
import LocalStorage from "../libs/LocalStorage";
//import { AuthProvider } from "../providers/AuthProvider";
import { getGlobalSignOut } from "../providers/AuthProvider";
import { i18n } from "../i18n";
import cfg from "../config";

/**
 * Version 2: HTTP-only cookies (handled server side)
 *  - no more refreshing the accessToken on the client side
 *  - the client assumes the server manages token lifecycles via cookies
 *  - enabled withCredentials (ensures cookies are sent with every request)
 *  - simplified "401 Unauthorized" handling (if the server indicates
 *    the session is invalid (401), redirect the user to the /signin page without retrying)
 *  - retained maintenance and error handling (the client still handles scenarios
 *    like maintenance mode or 404 errors gracefully)
 *  - request abortion (maintains support for canceling pending requests on user sign-out)
 * 
 * Advantages of this new approach:
 *  - security: tokens are stored securely as HTTP-only cookies, inaccessible to JavaScript;
 *    reduces exposure to XSS attacks
 *  - simplicity: eliminates client-side token storage and refresh complexity
 *  - cross-domain compatibility: the withCredentials flag ensures cookies work seamlessly
 *    across subdomains or different domains (when configured properly on the server)
 *  - scalability: by delegating token management to the server, it becomes easier to adapt
 *    this setup to distributed systems with centralized session stores (like Redis)
 */

// global flag to track sign-out status, to avoid retrying requests after sign-out
//let isSignedOut = false;
const abortControllers = new Map(); // define an abortControllers map

// create axios instance
const createInstance = () => {
  return axios.create({
    baseURL: `${cfg.siteUrl}/api`, // API base URL
    timeout: cfg.api.timeoutSeconds * 1000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // ensures cookies are sent with requests
  });
};

const instance = createInstance();
console.log(`axios instance base url is ${instance.defaults.baseURL}`);

// add request interceptor for appending additional headers
instance.interceptors.request.use(
  (config) => {
    // append the current language to request headers
    const currentLanguage = i18n.language || i18n.options.fallbackLng[0]; // get the current language from i18n
    config.headers["Accept-Language"] = currentLanguage;

    // append API version
    if (typeof config.headers["Accept-Version"] === "undefined") {
      const versionNumber = cfg.api.version;
      if (typeof versionNumber !== "undefined") {
        config.headers["Accept-Version"] = versionNumber;
      }
    }

    // add an AbortController for request cancellation
    const controller = new AbortController();
    config.signal = controller.signal;

    // track the controller for this request
    abortControllers.set(config.url, controller);

    return config;
  },
  (error) => Promise.reject(error)
);

// clean up the abort controller after the request completes
instance.interceptors.response.use(
  (response) => {
    abortControllers.delete(response.config.url);
    return response;
  },
  (error) => {
    if (error.config) {
      abortControllers.delete(error.config.url);
    }
    return Promise.reject(error);
  }
);

// add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    // // handle unauthorized (refresh token expired)
    // if (response?.status === 401) {
    //   //alert(401);
    //   console.warn("Session expired. Redirecting to /signin...");
    //   // Clear local auth state
    //   const signOut = getGlobalSignOut();
    //   if (signOut) {
    //     signOut("expired");
    //   }

    //   // Redirect to login page
    //   window.location.href = "/signin";

    //   // Cancel all ongoing requests
    //   cancelAllRequests();

    //   // Prevent the rejected request from bubbling with 401
    //   return Promise.reject(new axios.Cancel("Session expired (401)"));
    // }

    // handle server maintenance status
    if (response?.status === 503) {
      if (window.location.pathname !== "/work-in-progress") {
        LocalStorage.set("maintenanceStatus", true); // track maintenance status
        LocalStorage.set("maintenancePath", window.location.pathname); // track the user's path
        window.location.href = "/work-in-progress";
      }
    } else if (response) {
      LocalStorage.remove("maintenanceStatus");
      const maintenancePath = LocalStorage.get("maintenancePath");
      if (maintenancePath) {
        window.location.href = maintenancePath; // redirect back to the user's path post-maintenance
        LocalStorage.remove("maintenancePath");
      }
    }

    return Promise.reject(error); // no response from server
  }
);

// cancel all pending requests when the user signs out
export const cancelAllRequests = () => {
  //isSignedOut = true; // mark the user as signed out
  abortControllers.forEach((controller) => controller.abort());
  abortControllers.clear();
};

export default instance;
