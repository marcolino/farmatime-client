import Cookies from "js-cookie";

const Cookie = {
  get: (key) => {
    const value = Cookies.get(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },

  set: (key, value, options = {}) => {
    return Cookies.set(key, value, options);
    /*
      expires: days,
      path: "",
      domain: "",
    */
  },

  remove: (key) => {
    if (key) {
      return Cookies.remove(key);
    }
  },
};

export default Cookie;