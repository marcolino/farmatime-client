import { React } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { setupCustomConsole } from "./utils";
import config from "./config";

setupCustomConsole();

console.log(
  "mode:",
  config.mode.production ? "production" :
  config.mode.staging ? "staging" :
  config.mode.development ? "development" :
  config.mode.test ? "test" :
  "unforeseen"
);

createRoot(document.getElementById("root")).render(
  <App />
);
