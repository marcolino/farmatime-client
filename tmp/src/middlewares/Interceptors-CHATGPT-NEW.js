import axios from "axios";
import Cookie from "../libs/Cookie";
import { setDisableLoaderGlobal } from "../providers/LoaderState";
import { showGlobalSnackbar } from "../providers/SnackbarManager";
import cfg from "../config";
import { createBrowserHistory } from "history";

const history = createBrowserHistory(); // create a history object for navigation

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
    auth = Cookie.get("auth");
    if (!auth) {
      throw new Error("Auth cookie not found!");
    }

    const updatedAuth = JSON.parse(JSON.stringify(auth));

    if (updatedAuth.user && typeof updatedAuth.user === "object") {
      updatedAuth.user.accessToken = token;
    } else {
      throw new Error(`Invalid auth cookie structure: ${updatedAuth}`);
    }

    Cookie.set("auth", JSON.stringify(updatedAuth));
    return true;
  } catch (error) {
    console.error(`Error updating auth token: ${error}`);
    throw error;
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
    config.headers["Authorization"] = `Bearer ${getLocalAccessToken()}`;
    return config;
  },
  error => Promise.reject(error)
);

// response interceptor to handle maintenance mode
instance.interceptors.response.use(
  response => {
    if (response.headers["X-Maintenance-Status"] === "true") {
      history.push("/work-in-progress");
    }
    return response;
  },
  error => {
    return Promise.reject(new Error(`Unforeseen error while checking maintenance status: ${error.message}`));
  }
);

// response interceptor to handle 404, 401 and token refresh
instance.interceptors.response.use(
  response => response,  // Return the response if successful
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
          isRefreshing = false;
          clearLocalTokens();
          showGlobalSnackbar(refreshError.response.data.message, "warning");

          setDisableLoaderGlobal(true); // disable loader before redirection
          setTimeout(() => {
            setDisableLoaderGlobal(false); // re-enable loader after redirection

            // use the history object for navigation
            history.push("/signin"); // navigate to sign-in page
          }, cfg.ui.snacks.autoHideDurationSeconds * 1000);

          return Promise.reject(refreshError);
        }
      } else {
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

// helper to add subscribers for token refresh
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

// called when the token is refreshed
function onRefreshed(token) {
  refreshSubscribers.map(cb => cb(token));
}

export default instance;
