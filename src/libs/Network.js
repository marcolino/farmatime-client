import instance from "../middlewares/Interceptors";
import { i18n } from "../i18n";
import config from "../config";

//const PROD_DOMAINS = ["farmatime.it", "www.farmatime.it", "staging.farmatime.it"];

const isLocalEnv = () => {
  try {
    return (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
};

// const isProdUrl = (url) => {
//   return PROD_DOMAINS.some(domain => url.includes(domain));
// };

const apiCall = async (method, url, data = {}) => {
  //console.log("+++++++++++++++++++ config.api.productionDomains:", config.api.productionDomains);
  //console.log("+++++++++++++++++++ OLD PROD_DOMAINS:", PROD_DOMAINS);
  try {
    /*
    // Check for environment mismatch
    if (isLocalEnv() && isProdUrl(url)) {
      const message = `API CALL BLOCKED: Attempted to call production url ${url} from ${window?.location?.hostname}`;
      if (config.mode.development) {
        alert(message);
      }
      console.error(`%c🚫 ${message}`, "color: red; font-weight: bold;");
      console.error("→ URL:", url);
      console.error("→ Window origin:", window.location.origin);
      console.error("→ This usually means injected config is stale (production API in local build).");

      return {
        err: true,
        message: i18n.t("Development environment attempted to contact production API"),
      };
    }
    */

    // Handle FormData header setup
    const cfg = {};
    if (data instanceof FormData) {
      cfg.headers = { "Content-Type": "multipart/form-data" };
    }

    // Handle GET params
    if (method.localeCompare("GET", undefined, { sensitivity: "accent" }) === 0) {
      data = { params: data };
    }

    // Perform the actual API call
    const response = await instance[method](url, data, cfg);
    console.info(`⇒ ${url} success:`, response.data);
    return { ...response.data };
  } catch (err) {
    // error handling logic
    if (!err) {
      console.error(`⇒ ${url} undefined error!`);
      return { err: true, message: i18n.t("An undefined error occurred") };
    }
    if (err.response) {
      console.error(`⇒ ${url} error response`, err.response);
      return {
        err: true,
        message: err.response.data?.message ?? err.message ?? err.response.toString(),
        status: err.response.status,
        data: err.response.data,
        code: err.response.data?.code,
      };
    }
    if (err.request) {
      console.error(`⇒ ${url} no response received, request was:`, err.request);
      if (err.code === "ECONNABORTED") {
        return { err: true, message: i18n.t("Request timed out; please try again") };
      }
      return { err: true, message: i18n.t("No response from server; please check your connection") };
    }
    console.error(`⇒ ${url} request error:`, err.message);
    return { err: true, message: i18n.t(err.message) };
  }
};

export { apiCall };
