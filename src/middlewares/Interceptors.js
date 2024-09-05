import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "../components/Toast";
import cfg from "../config";


const cookies = new Cookies();

// track whether the token is being refreshed
let isRefreshing = false;
let refreshSubscribers = [];

// storage functions
const getLocalAccessToken = () => {
  return cookies.get("auth")?.user?.accessToken;
}

const setLocalAccessToken = (token) => {
  const currentAuth = cookies.get("auth");
  cookies.set("auth", { ...currentAuth, user: { ...currentAuth.user, accessToken: token } });
}

const getLocalRefreshToken = () => {
  return cookies.get("auth")?.user?.refreshToken;
}

const clearLocalTokens = () => {
  const currentAuth = cookies.get("auth");
  cookies.set("auth", { ...currentAuth, "user": false });
};

// create axios instance
const createInstance = () => {
  return axios.create({
    baseURL: "/api",
    timeout: 10 * 1000,
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": getLocalAccessToken(),
    }
  });
};

const instance = createInstance();
const instanceForRefresh = createInstance();

// add a request interceptor to append authentication token to request headers
instance.interceptors.request.use(
  config => {
    //const token = getLocalAccessToken();
    // if (token) {
    //   config.headers["X-Auth-Token"] = token;
    //   config.headers["Authorization"] = token;
    // }
    config.headers["Authorization"] = getLocalAccessToken();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// add a request interceptor to append the version number to every request url
instance.interceptors.request.use(
  config => {
    if (typeof config.headers["Accept-Version"] === "undefined") { // if set already, keep it as-is, otherwise use default
      const versionNumber = process.env.REACT_APP_API_VERSION || "v1";
      config.headers["Accept-Version"] = versionNumber;
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
    if (response.status === 404) {
      //router.push({ name: 'notfound' }); // router ???
      window.location.href = "/404";
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
          //window.location.href = "/signin";
          // refreshError.redirect = {
          //   path: "/signin", // path to redirect to in the error boundary
          //   message: refreshError.response.data.message // message to show
          // };

          toast.warning(refreshError.response.data.message);

          // delay the redirection
          setTimeout(() => {
            window.location.href = "/signin";
          }, cfg.ui.toastAutoCloseSeconds * 1000);
          
          refreshError.response.data.message = null; // avoid double error toasting on component
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
