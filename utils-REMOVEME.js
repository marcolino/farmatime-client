import config from "./config";

export function setupCustomConsole() {
  if (!("devAlert" in console)) {
    console.devAlert = message => {
      if (config.mode.development) {
        console.info("%c" + message, "color: red; -webkit-text-stroke: 2px black; font-size: 64px; font-weight: bold;");
      }
    };
  }
}
