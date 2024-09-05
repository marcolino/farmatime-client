import firebase from "firebase/app";
import "firebase/messaging";

// TODO: put in .env or config
const firebaseConfig = { // TODO...
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "sistemisolari-quiccasa.firebaseapp.com",
  projectId: "sistemisolari-quiccasa",
  storageBucket: "sistemisolari-quiccasa.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
  //measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
// console.firebase.com - Project - Projetc Settings - Cloud Messaging - Certificati Web Push - Coppia di chiavi
const vapidKey = process.env.REACT_APP_VAPID_KEY,
const tokenKey = process.env.REACT_APP_TOKEN_KEY,
const tokenMaxValidityTimeSpan = 7 * 60 * 60 * 24 * 1000; // one week (in milliseconds)

if (!firebase.apps.length) { // if never inizialized, inizialize app
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

let messaging;
try {
  messaging = firebase.messaging();
} catch (err) {
  console.info("This browser does not support Firebase SDK");
  messaging = {}; // create a dummy messaging object
  messaging.getToken = async() => {};
  messaging.onMessage = async() => {};
}

export const getToken = (setToken) => {
  // check if we already have a valid token saved to local storage
  const currentTokenString = localStorage.getItem(tokenKey);
  if (currentTokenString) {
    const currentToken = JSON.parse(currentTokenString);
    if (currentToken.timestamp > new Date().getTime() + tokenMaxValidityTimeSpan) { // consider fresh for one week at most
      // token in local storage is fresh
      return currentToken;
    }
  }

  // we do not already have a valid token saved to local storage, get it from firebase
  return messaging.getToken({vapidKey}).then((token) => {
    if (token) {
      console.info("PushNotifications - Firebase - current token for client:", token);
      if (setToken) setToken(token);
      // TODO: track the token -> client mapping, by sending to backend server, and
      // show on the UI that permission is secured
      localStorage.setItem(tokenKey, JSON.stringify({value: token, timestamp: new Date().getTime()}));
    } else {
      console.info("No registration token available, requesting permission to generate one...");
      if (setToken) setToken(null);
      // shows on the UI that permission is required
    }
  }).catch(err => { // catch error while creating client token
    if (err.code === "messaging/permission-blocked") {
      console.error("Notification permission denied by user, token not retrieved");
    } else {
      if (err.code === "messaging/failed-service-worker-registration") {
        console.error("Service worker registration failed");
      } else {
        console.error("Error while creating client token:", JSON.stringify(err));
      }
    }
    if (setToken) setToken(null);
  });
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
});
