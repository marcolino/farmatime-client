//import React from "react";
import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { setupCustomConsole } from "./libs/Misc";
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
  // <BrowserRouter
  //   future={{ /* avoid v7 start transition warnings */ 
  //     v7_startTransition: true,
  //     v7_relativeSplatPath: true,
  //   }}
  // >
  <App />
  // </BrowserRouter>
);
