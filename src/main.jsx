import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// import App from "./c.jsx";
import "./main.css";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { ToastContainer, toast } from "./components/Toast";
import { i18n } from "./i18n";
import config from "./config";

console.log(
  config.mode.production ? "production" :
  config.mode.development ? "development" :
  config.mode.test ? "test" :
        "unforeseen", "mode");
  
// createRoot(document.getElementById("root")).render(
//   config.mode.development ? // TODO: should we really avoid StrictMode in production?
//     <StrictMode>
//       <App />
//     </StrictMode>
//     :
//     <App />
// );
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);


// if we want app to work offline and load faster, we can change
// unregister() to register() below; note this comes with some pitfalls;
// learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister(); // TODO: TO BETTER DEBUG
serviceWorkerRegistration.register();

// set up a broadcast channel to localize messages from i18n service worker
const channelI18nMessages = new BroadcastChannel("sw-i18n-messages");
channelI18nMessages.addEventListener("message", event => {
  toast[event.data.level](i18n.t(event.data.message));
});

// set up a broadcast channel to localize messages from background push messages service worker
const channelBackgroundPushMessages = new BroadcastChannel("sw-background-push-messages");
channelBackgroundPushMessages.addEventListener("message", event => {
console.log('received event.data:', event.data);
  toast[event.data.level](i18n.t(event.data.message));
});
