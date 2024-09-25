// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// set up a broadcast channel to the clients to be able to translate service worker messages
//const broadcastChannel = new BroadcastChannel("sw-i18n-messages");

// dummy `t` function to persuade i18-next to parse these text messages too
const t = (args) => {
  return args;
}

export function register(config) {
console.log("SW", "REGISTERING 1");
  if (process.env.NODE_ENV === "production") {
    if ("serviceWorker" in navigator) {
      // The URL constructor is available in all browsers that support SW.
      const publicUrl = new URL(import.meta.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        console.log("SW", "REGISTERING 2");
        // Our service worker won't work if PUBLIC_URL is on a different origin
        // from what our page is served on. This might happen if a CDN is used to
        // serve assets; see https://github.com/facebook/create-react-app/issues/2374
        return;
      }
      console.log("SW", "REGISTERING 3");

      window.addEventListener("load", () => {
        const swUrl = `${import.meta.env.VITE_PUBLIC_URL}/service-worker.js`;
        console.log("SW", "REGISTERING 4");

        if (isLocalhost) {
          // This is running on localhost. Let's check if a service worker still exists or not.
          checkValidServiceWorker(swUrl, config, t);
          // Add some additional logging to localhost, pointing developers to the
          // service worker/PWA documentation.
          console.log("SW", "REGISTERING 5");
          navigator.serviceWorker.ready.then(() => {
            //broadcastChannel.postMessage({level: "info", message:
            //}); // do not bore users with unregister errors
            console.log(
              "This web app is being locally served cache-first by a service worker. To learn more, visit https://cra.link/PWA"
            );
            console.log("SW", "REGISTERING 6");

            navigator.serviceWorker.controller.postMessage({
              type: "SHOW_SNACKBAR",
              level: "info",
              message: t("Registering SW")
            });
          
          });
        } else {
          console.log("SW", "REGISTERING 7");
          // Not localhost, just register service worker
          registerValidSW(swUrl, config);
        }
      });
    } else {
      console.warn("no serviceWorker in navigator");
    }
  } else {
    console.warn("environment is not production");
    console.log("SW", "REGISTERING 9");
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              // broadcastChannel.postMessage({level: "info", message:
              //   t("New content is available and will be used when all " +
              //   "tabs for this page are closed.") // See https://cra.link/PWA.
              // });
              navigator.serviceWorker.controller.postMessage({
                type: "SHOW_SNACKBAR",
                level: "info",
                message: t("New content is available and will be used when all tabs for this page are closed") + "." // See https://cra.link/PWA.
              });

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // broadcastChannel.postMessage({level: "info", message:
              //   t("Content is cached for offline use.")
              // });
              navigator.serviceWorker.controller.postMessage({
                type: "SHOW_SNACKBAR",
                level: "info",
                message: t("Content is cached for offline use") + "."
              });

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      // broadcastChannel.postMessage({level: "error", message:
      //   t("Error during service worker registration: {{error}}", error)
      // });
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_SNACKBAR",
        level: "error",
        message: t("Error during service worker registration: {{error}}", error)
      });
    })
  ;
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found, proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      // broadcastChannel.postMessage({level: "info", message:
      //   t("No internet connection found. App is running in offline mode.")
      // });
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_SNACKBAR",
        level: "info",
        message: t("No internet connection found, the app is running in offline mode") + "."
      });
    })
  ;
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        // broadcastChannel.postMessage({level: "error", message:
        //   t(error.message) // TODO: how to localize these errors?
        // });
        console.error(error.message); // do not bore users with unregister errors
      });
  }
}
