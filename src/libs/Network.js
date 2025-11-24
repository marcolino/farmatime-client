import instance from "../middlewares/Interceptors";
import { i18n } from "../i18n";
import config from "../config";

const PROD_DOMAINS = [config.domain, `www.${config.domain}`, `staging.${config.domain}`];

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

const isProductionUrl = (hostname) => {
  return PROD_DOMAINS.some(domain => hostname === domain);
};

const apiCall = async (method, path, data = {}) => {
  try {

    // Check for environment mismatch
    const hostname = new URL(instance?.defaults?.baseURL)?.hostname;
    if (isLocalEnv() && isProductionUrl(hostname)) {
      const message = `API CALL BLOCKED: Attempted to call production hostname: ${hostname} with path ${path} from ${window?.location?.hostname}`;
      alert(message);
      console.log(`\
%c🚫 ${message}
Hostname: ${hostname}
Path: ${path}
Window origin: ${window.location.origin}
This usually means injected config is stale (production API in local build).
Please re-inject development config.
`, "color: red; font-weight: bold;"
      );

      return {
        err: true,
        message: i18n.t("Development environment attempted to contact production API"),
      };
    }

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
    const response = await instance[method](path, data, cfg);
    console.info(`⇒ ${path} success:`, response.data);
    return { ...response.data };
  } catch (err) {
    // error handling logic
    if (!err) {
      console.error(`⇒ ${path} undefined error!`);
      return { err: true, message: i18n.t("An undefined error occurred") };
    }
    if (err.response) {
      console.error(`⇒ ${path} error response`, err.response);
      return {
        err: true,
        message: err.response.data?.message ?? err.message ?? err.response.toString(),
        status: err.response.status,
        data: err.response.data,
        code: err.response.data?.code,
      };
    }
    if (err.request) {
      console.error(`⇒ ${path} no response received, request was:`, err.request);
      if (err.code === "ECONNABORTED") {
        return { err: true, message: i18n.t("Request timed out; please try again") };
      }
      return { err: true, message: i18n.t("No response from server; please check your connection") };
    }
    console.error(`⇒ ${path} request error:`, err.message);
    return { err: true, message: i18n.t(err.message) };
  }
};

export { apiCall };
