import axios from "axios";
//import Cookies from "universal-cookie";
//import Cookies from "js-cookie";
import Cookie from "../libs/Cookie";
import { toast } from "../components/Toast";
import cfg from "../config";

//const cookies = new Cookies();

// track whether the token is being refreshed
let isRefreshing = false;
let refreshSubscribers = [];

// storage functions
const getLocalAccessToken = () => {
  return Cookie.get("auth")?.user?.accessToken;
}

const setLocalAccessToken = (token) => {
  const currentAuth = Cookie.get("auth");
  Cookie.set("auth", { ...currentAuth, user: { ...currentAuth?.user, accessToken: token } });
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
    //baseURL: "/api", // used when running on the server, in client/build folder...
    baseURL: "http://localhost:5000/api", // used when running on the client, while developing
    timeout: 10 * 1000,
    headers: {
      "Content-Type": "application/json",
      //"X-Auth-Token": getLocalAccessToken(),
    }
  });
};

const instance = createInstance();
const instanceForRefresh = createInstance();

// add a request interceptor to append authentication token to request headers
instance.interceptors.request.use(
  config => {
    config.headers["Authorization"] = getLocalAccessToken();
    console.log("instance.interceptors.request.use config:", config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// log requests and responses (DEBUG ONLY)
instance.interceptors.request.use(
  config => {
    console.log("Request Config:", config);
    return config;
  },
  error => {
    console.log("Request Error:", error);
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
    console.log("instanceForRefresh response:", response);
    setLocalAccessToken(response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.log("instanceForRefresh error:", error);
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
          toast.warning(refreshError.response.data.message);
          setTimeout(() => { // redirect to signin page with some delay, to allow toast to be read
            window.location.href = "/signin";
          }, cfg.ui.toastAutoCloseSeconds * 1000);
          refreshError.response.data.message = null; // avoid double error toasting on component (TODO: ??? check what happens removing this line...)
          return Promise.reject(refreshError);
        }
      } else {
        // token refresh already in progress
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(token => {
            //config.headers["X-Auth-Token"] = token; // TODO: REMOVE-ME?
            config.headers["Authorization"] = token;
            resolve(instance(config));
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
