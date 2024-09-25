import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
//import "./main.css";
//import { registerSW } from "virtual:pwa-register";
//import * as serviceWorkerRegistration from "../serviceWorkerRegistration";
//import { ToastContainer, toast } from "./components/Toast";
//import Snackbar from "@mui/material/Snackbar";
//import { i18n } from "./i18n";
import config from "./config";

// const updateSW = registerSW({
//   onNeedRefresh() {
//     // show a prompt to the user to refresh the app
//   },
//   onOfflineReady() {
//     // show a ready to work offline to user
//   },
// });

console.log(
  config.mode.production ? "production" :
  config.mode.development ? "development" :
  config.mode.test ? "test" :
        "unforeseen", "mode");
  
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);


// extend console class with devAlert, to very clearly show important info while developing (like verification codes)
if (!("devAlert" in console)) {
  console.devAlert = message => {
    !config.mode.production && console.info("%c" + message, "color: red; -webkit-text-stroke: 2px black; font-size: 64px; font-weight: bold;");
  };
}


// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('../service-worker.js', { type: 'module' })
//     .then(registration => {
//       console.log('Service worker registered:', registration);
//     })
//     .catch(error => {
//       console.log('Service worker registration failed:', error);
//     }
//   );
// }
// if we want app to work offline and load faster, we can change
// unregister() to register() below; note this comes with some pitfalls;
// learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister(); // TODO: TO BETTER DEBUG
//serviceWorkerRegistration.register();

  // if (serviceWorkerRegistration.register()) {
  // a service worker was eefectively registered

  // // set up a broadcast channel to localize messages from i18n service worker
  // const channelI18nMessages = new BroadcastChannel("sw-i18n-messages");
  // channelI18nMessages.addEventListener("message", event => {
  //   toast[event.data.level](i18n.t(event.data.message));
  // });

  // // set up a broadcast channel to localize messages from background push messages service worker
  // const channelBackgroundPushMessages = new BroadcastChannel("sw-background-push-messages");
  // channelBackgroundPushMessages.addEventListener("message", event => {
  //   console.log("received event.data:", event.data);
  //   toast[event.data.level](i18n.t(event.data.message));
  // });
// }
