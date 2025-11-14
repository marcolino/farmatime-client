import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { setupConsoleDevAlert } from "./libs/Misc";
import config from "./config";

setupConsoleDevAlert();

console.info(
  "mode:",
  config.mode.production ? "production" :
  config.mode.staging ? "staging" :
  config.mode.development ? "development" :
  config.mode.test ? "test" :
  "unforeseen"
);

createRoot(document.getElementById("root")).render(<App />);
