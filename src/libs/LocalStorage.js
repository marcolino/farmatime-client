const LocalStorage = {
  get: (key) => {
    if (localStorage) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (err) {
        console.warn(`localStorage key {key} value is not valid:`, err);
        return null;
      }
    } else {
      console.warn("localStorage is not available");
      return null;
    }
  },

  set: (key, value = {}) => {
    if (localStorage) {
      try {
        const val = JSON.stringify(value);
        localStorage.setItem(key, val);
        return val;
      } catch (err) {
        console.warn(`localStorage key {key} value {value} is not valid:`, err);
        return null;
      }
    } else {
      console.warn("localStorage is not available");
      return null;
    }
  },

  remove: (key) => {
    if (localStorage) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.warn(`localStorage key {key} can't be removed:`, err);
        return null;
      }
    } else {
      console.warn("localStorage is not available");
    }
  },

  clear: () => {
    if (localStorage) {
      try {
        localStorage.clear();
        return true;
      } catch (err) {
        console.warn(`localStorage can't be cleared:`, err);
        return null;
      }
    } else {
      console.warn("localStorage is not available");
    }
  },

};

export default LocalStorage;