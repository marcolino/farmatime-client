import instance from "../middlewares/Interceptors";

let counter = 0;
let listeners = new Set();

function notify() {
  for (const cb of listeners) {
    try {
      cb(counter);
    } catch (e) {
      console.warn("Loader listener error:", e);
    }
  }
}

function inc() {
  counter++;
  notify();
}

function dec() {
  counter = Math.max(0, counter - 1);
  notify();
}

/**
 * Subscribe to loader state.
 * @param {Function} cb callback that receives current counter
 * @returns {Function} unsubscribe function
 */
export const addLoaderListener = (cb) => {
  listeners.add(cb);
  cb(counter); // sync immediately
  return () => {
    listeners.delete(cb);
  };
};

// attach interceptors once at module load
instance.interceptors.request.use(
  (cfg) => {
    inc();
    return cfg;
  },
  (error) => {
    dec();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    dec();
    return response;
  },
  (error) => {
    dec();
    return Promise.reject(error);
  }
);

export default instance;
