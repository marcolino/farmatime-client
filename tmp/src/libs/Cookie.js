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
      console.error(`Can't get cookie key "${key}" because value is not valid json:`, value);
      return null;
    }
  },

  set: (key, value, options = {}) => {
    try {
      return Cookies.set(key,  JSON.stringify(value), options);
      /*
        expires: days,
        path: "",
        domain: "",
      */
    } catch (error) {
      console.error(`Can't set cookie key "${key}" with value ${value}`);
      return null;
    }
  },

  remove: (key) => {
    if (key) {
      return Cookies.remove(key);
    }
  },
};

export default Cookie;