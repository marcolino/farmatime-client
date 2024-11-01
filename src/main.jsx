import { React/*, StrictMode*/ } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { setupCustomConsole } from "./utils";
import config from "./config";

setupCustomConsole();

console.log(
  config.mode.production ? "production" :
  config.mode.staging ? "staging" :
  config.mode.development ? "development" :
  config.mode.test ? "test" :
  "unforeseen",
  "mode"
);

createRoot(document.getElementById("root")).render(
  // StrictMode renders everything TWICE, disabling it also for development (in production it should be a noop...)
  //<StrictMode>
    <App />
  //</StrictMode>
);
