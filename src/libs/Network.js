import axios from "axios";
import { i18n } from "../i18n";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const apiCall = async (method, url, data = null) => {
  try {
    const response = await api[method](url, data);
    console.info(`${url} success:`, response.data);
    return { ...response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        // the request was made and the server responded with a status code out of the range of 2xx
        console.error(`${url} error response`, err.response);
        return { 
          err: true, 
          status: err.response.status,
          message: err.response.data?.message || i18n.t("An unspecified error occurred"),
          data: err.response.data
        };
      } else if (err.request) {
        // the request was made but no response was received
        console.error(`${url} no response received, reques was:`, err.request);
        if (err.code === "ECONNABORTED") {
          return { err: true, message: i18n.t("Request timed out; please try again") };
        }
        return { err: true, message: i18n.t("No response from server; please check your connection") };
      } else {
        // something happened in setting up the request that triggered an Error
        console.error(`${url} request error:`, err.message);
        return { err: true, message: i18n.t("Failed to send request") };
      }
    } else { // non-Axios error
      console.error(`${url} unexpected error:`, err);
      return { err: true, message: i18n.t("An unexpected error occurred") };
    }

/*
    if (err.response) {
      console.error("Error response:", err.response);
      return { ok: false, ...err.response.data };
    } else if (err.request) {
      console.error("No response received:", err.request);
      return { ok: false, message: i18n.t("No response from server; please check your connection") };
    } else {
      console.error("Other error:", err.message);
      return { ok: false, message: err.message };
    }
*/
  }
};

export {
  apiCall,
};
