import ReactDOM from "react-dom";
import ReactPWAInstallProvider, { useReactPWAInstall } from "react-pwa-install";
import myLogo from "img/logo.png";
 
function App() {
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall();
 
  const handleClick = () => {
    pwaInstall({
      title: "Install Web App",
      logo: myLogo,
      features: (
        <ul>
          <li>Cool feature 1</li>
          <li>Cool feature 2</li>
          <li>Even cooler feature</li>
          <li>Works offline</li>
        </ul>
      ),
      description: "This is a very good app that does a lot of useful stuff. ",
    })
      .then(() => alert("App installed successfully or instructions for install shown"))
      .catch(() => alert("User opted out from installing"));
  };
 
  return (
    <div>
      {supported() && !isInstalled() && (
        <button type="button" onClick={handleClick}>
          Install App
        </button>
      )}
    </div>
  );
}
 
ReactDOM.render(
  <ReactPWAInstallProvider enableLogging>
    <App />
  </ReactPWAInstallProvider>,
  document.querySelector("#root")
);


/*
import { useReactPWAInstall } from 'react-pwa-install';

function InstallPrompt() {
  const { supported, isInstalled, pwaInstall } = useReactPWAInstall();

  const handleInstallClick = async () => {
    try {
      await pwaInstall();
    } catch {
      // User dismissed or unsupported - show manual install instructions
      alert(localizedManualInstallInstructions);
    }
  };

  if (!supported || isInstalled) return null;

  return (
    <button onClick={handleInstallClick}>
      {localizedInstallButtonText}
    </button>
  );
}



const isIos = () => {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
};

const isInStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const isFirefox = () => /firefox/i.test(window.navigator.userAgent);

const supportsPwaInstallPrompt = () => 'onbeforeinstallprompt' in window;

const needsManualInstall = () => {
  if (isInStandaloneMode()) {
    // Already installed
    return false;
  }
  if (isIos()) {
    // iOS Safari pre-16.4 or other iOS browsers without prompt
    return true;
  }
  if (isFirefox()) {
    return true; // Firefox doesn't support native prompt
  }
  if (!supportsPwaInstallPrompt()) {
    return true; // Other unsupported browsers
  }
  return false;
};
*/