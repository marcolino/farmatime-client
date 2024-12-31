import axios from "axios";
import instance from "../middlewares/Interceptors";
import LocalStorage from "./LocalStorage";
import { i18n } from "../i18n";


const isUserLogged = () => {
  return !!LocalStorage.get("auth")?.user;
}

const apiCall = async(method, url, data = {}) => {
  try {
    // check if the data is a FormData object and set headers accordingly
    const cfg = {};
    if (data instanceof FormData) {
      cfg.headers = {
        "Content-Type": "multipart/form-data",
      };
    }
    // if it's a GET, put data inside params
    if (method.localeCompare("GET", undefined, { sensitivity: "accent" }) === 0) {
      data = { params: data };
    }
    const response = await instance[method](url, data, cfg);
    console.info(`⇒ ${url} success:`, response.data);
    return { ...response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        // the request was made and the server responded with a status code out of the range of 2xx
        console.error(`${url} error response`, err.response);
        const message = err.response.data?.message ?? err.message
        if (message) { // if some data.message, show it to the user
          const code = err.response.data?.code;
          // if (
          //   code && isUserLogged() && (
          //     (code === "NO_TOKEN") ||
          //     (code === "EXPIRED_TOKEN") ||
          //     (code === "BAD_TOKEN") ||
          //     (code === "WRONG_TOKEN")
          //   )
          // ) {
          //   return {
          //     err: true,
          //     message,
          //     status: err.response.status,
          //   };
          // } else {
            return {
              err: true,
              status: err.response.status,
              message,
              data: err.response.data
            };
          //}
        } else {
          return {
            err: true,
            status: err.response.status,
            message: err.response.toString(),
            data: err.response.data
          }
        }
      } else if (err.request) {
        // the request was made but no response was received
        console.error(`⇒ ${url} no response received, reques was:`, err.request);
        if (err.code === "ECONNABORTED") {
          return { err: true, message: i18n.t("Request timed out; please try again") };
        }
        return { err: true, message: i18n.t("No response from server; please check your connection") };
      } else {
        // something happened in setting up the request that triggered an Error
        console.error(`⇒ ${url} request error:`, err.message);
        return { err: true, message: i18n.t("Failed to send request") };
      }
    } else { // non-Axios error
      console.error(`⇒ ${url} unexpected error:`, err.message);
      return { err: true, message: i18n.t("An unexpected error occurred: {{err}}", { err: err.message }) };
    }
  }
};

export { apiCall };
