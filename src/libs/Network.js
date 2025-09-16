import instance from "../middlewares/Interceptors";
import { i18n } from "../i18n";


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
      message: i18n.t(err.message)
    };
  }
};

export { apiCall };
