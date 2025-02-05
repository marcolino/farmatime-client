//import axios from "axios";
import instance from "../middlewares/Interceptors";
//import LocalStorage from "./LocalStorage";
import { i18n } from "../i18n";


// const isUserLogged = () => {
//   return !!LocalStorage.get("auth")?.user;
// }

const apiCall = async(method, url, data = {}) => {
  try {
    const cfg = {};
    if (data instanceof FormData) { // check if the data is a FormData object and set headers accordingly
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
    if (!err) {
      // no error caught
      console.error(`⇒ ${url} undefined error!`);
      return {
        err: true,
        message: i18n.t("An undefined error occurred")
      };
    }
    if (err.response) {
      // the request was made and the server responded with a status code out of the range of 2xx
      console.error(`⇒ ${url} error response`, err.response);
      const message = err.response.data?.message ?? err.message ?? err.response.toString();
      // if (!message) {
      //   message = err.response.toString();
      // }
      //const code = err.response.data?.code;
      return {
        err: true,
        message: err.response.data?.message ?? err.message ?? err.response.toString(),
        status: err.response.status,
        data: err.response.data,
        code: err.response.data?.code
      };
    }
    if (err.request) {
      // the request was made but no response was received
      console.error(`⇒ ${url} no response received, request was:`, err.request);
      if (err.code === "ECONNABORTED") {
        return {
          err: true,
          message: i18n.t("Request timed out; please try again")
        };
      }
      return {
        err: true,
        message: i18n.t("No response from server; please check your connection")
      };
    }
    // something happened in setting up the request that triggered an error
    console.error(`⇒ ${url} request error:`, err.message);
    return {
      err: true,
      //message: i18n.t("Failed to send request")
      message: i18n.t(err.message) // TODO: translate these messages in misc/strings-for-translation
    };

    // AI /////////////////////////////////////////////////////////////////////////////////////
    // console.log("ERR:", err);
    // if (err.response) {
    //   // Axios received a response but with a status code outside the 2xx range
    //   console.error(`API error: ${err.response.status} - ${err.response.data.message}`);
    //   return Promise.reject({
    //     status: err.response.status,
    //     data: err.response.data,
    //   });
    // } else if (err.request) {
    //   // Axios made a request but did not receive a response
    //   console.error("No response received:", err.request);
    //   return Promise.reject({
    //     message: "No response received from the server.",
    //   });
    // } else {
    //   // Other errors
    //   console.error("API call failed:", err.message);
    //   return Promise.reject({
    //     message: err.message,
    //   });
    // }
    ///////////////////////////////////////////////////////////////////////////////////////////////
  }
};

export { apiCall };
