import Cookies from "js-cookie";

const Cookie = {
  get: (key) => {
    const value = Cookies.get(key);
    try {
      if (value) {
        return JSON.parse(value);
      } else {
        return null;
      }
    } catch (error) {
      console.error(`cookie key "${key}" value is not valid json:`, value);
      return null;
    }
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