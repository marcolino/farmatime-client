import React from "react";
import { format } from 'date-fns';
import { enUS, it, fr, de, es } from 'date-fns/locale';
import LocalStorage from "../libs/LocalStorage";
import { i18n } from "../i18n";
import config from "../config";


export const isEmptyObject = (obj) => {
  return (
    obj ? // null and undefined check
      Object.keys(obj).length === 0 && // empty object check
      obj.constructor === Object // Object.keys(new Date()).length === 0; so we have to check it is not a Date
    :
      true
  );
};

export const objectIsEmpty = (obj) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
};

export const isNull = (v) => {
  return (v == null);
};

export const isBoolean = (v) => {
  return typeof v === "boolean";
};

export const isString = (v) => {
  return (typeof v === "string");
};

export const isNumber = (v) => {
  return typeof v === "number" && isFinite(v);
};

export const isArray = (v) => {
  //return v && v.constructor === Array;
  return (typeof v === "object" && Array.isArray(v));
};

export const isObject = (v) => {
  return (typeof v === "object" && !Array.isArray(v));
};

export const objectsAreEqual = (o1, o2) => {
  const retval = Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every(p => o1[p] === o2[p])
  ;
  return retval;
};

export const objectsAreDeepEqual = (a, b) => {
  if (a === b) return true;

  //if (typeof a !== typeof b) return false;
  if (typeof a !== typeof b) {
    console.log("objectsAreDeepEqual FALSE 1:", a, b, typeof a, typeof b);
    return false;
  }

  if (typeof a !== "object" || a === null || b === null) {
    //return a === b;
    if (!(a === b)) {
      console.log("objectsAreDeepEqual FALSE 2:", a, b, typeof a, typeof b);
    }
    return a === b;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  //if (keysA.length !== keysB.length) return false;
  if (keysA.length !== keysB.length) {
    console.log("objectsAreDeepEqual FALSE 3:", keysA.length, keysB.length);
    return false;
  }

  return keysA.every(key => { console.log("KEY:", key); return objectsAreDeepEqual(a[key], b[key]) });
};

// deeply merge objects with precedence to the source one
export const deepMergeObjects = (target, source) => {
  for (let key in source) {
    // check if the value is an object or an array
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      // if both target and source have the same key and they are objects, merge them recursively
      if (key in target) {
        Object.assign(source[key], deepMergeObjects(target[key], source[key]));
      }
    } else if (Array.isArray(source[key])) {
      // if the value is an array, merge arrays by concatenating them
      target[key] = (target[key] || []).concat(source[key]);
    }
  }
  // combine target and updated source
  return Object.assign(target || {}, source);
};

export const currencyFormat = (value, currencySymbol) => {
  return currencySymbol + " " + (value / 100).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

// check if consent is expired
const cookiesIsConsentExpired = (timestamp) => {
  const expirationTimeMilliseconds = config.cookies.expirationDays * 24 * 60 * 60 * 1000;
  return new Date().getTime() > (timestamp + expirationTimeMilliseconds);
};

// load consent from local storage
export const cookiesConsentLoad = () => {
  const storedData = LocalStorage.get(config.cookies.key);
  if (storedData) {
    //const parsedData = JSON.parse(storedData);
    if (!cookiesIsConsentExpired(storedData.timestamp)) {
      // setIsConsentGiven(storedData.consent);
      // setProfilingConsent(storedData.consent.profiling);
      // setStatisticsConsent(storedData.consent.statistics);
      // return;
      return {
        technical: storedData.consent.technical,
        profiling: storedData.consent.profiling,
        statistics: storedData.consent.statistics,
      };
    }
    // consent expired, remove it
    //LocalStorage.remove(config.cookies.key);
  }
  //setIsConsentGiven(null); // trigger consent modal display
  return null;
};

// save consent to local storage with current timestamp
export const cookiesConsentSave = (newConsent) => {
  const consentData = {
    consent: newConsent,
    timestamp: new Date().getTime(),
  };
  LocalStorage.set(config.cookies.key, consentData);
  //setIsConsentGiven(newConsent);
  return newConsent;
};

export const isValidRegex = (regexString) => {
  try {
    new RegExp(regexString);
    return true;
  } catch (err) {
    //console.warn("Regular expression is not valid:", err);
    return false;
  }
};

export const escapeRegex = (string) => {
  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

export const encodeEmail = (email) => {
  let encodedEmail = "";
  
  if (!email) {
    return "";
  }

  function charToOctal(char) {
    return ("0" + char.charCodeAt(0).toString(8)).slice(-3);
  }

  for (let i = 0; i < email.length; i++) {
    let charNum = "000";
    let curChar = email.charAt(i);
    if (curChar.match(/[a-z0-9& _\-@.]/i)) charNum = charToOctal(curChar);
    if (charNum === "000") {
      encodedEmail += curChar;
    } else {
      encodedEmail += "&#" + charNum + ";";
    }
  }

  // TODO: return encodedEmail, let caller create element...
  return React.createElement("span", { dangerouslySetInnerHTML: { __html: encodedEmail } });
};

/**
 * @param {Number} seconds 
 * @returns {String} a human text representation of a duration in seconds
 *
 * Examples:
 * console.log(convertSeconds());            // "instant"
 * console.log(convertSeconds(0));           // "instant"
 * console.log(convertSeconds(45));          // "45 seconds"
 * console.log(convertSeconds(120));         // "2 minutes"
 * console.log(convertSeconds(3600));        // "1 hour"
 * console.log(convertSeconds(86400));       // "1 day"
 * console.log(convertSeconds(604800));      // "1 week"
 * console.log(convertSeconds(2592000));     // "1 month"
 * console.log(convertSeconds(31557600));    // "1 year"
 * console.log(convertSeconds(3155760000));  // "1 century"
 */
export const secondsToHumanDuration = (seconds) => {
  seconds = Math.floor(seconds ?? 0);
  let t = i18n.t;

  const timeUnits = [
    { unit: t("century"), units: t("centuries"), seconds: 60 * 60 * 24 * 365.25 * 100 },
    { unit: t("year"), units: t("years"), seconds: 60 * 60 * 24 * 365.25 },
    { unit: t("month"), units: t("months"), seconds: 60 * 60 * 24 * 30.44 },
    { unit: t("week"), units: t("weeks"), seconds: 60 * 60 * 24 * 7 },
    { unit: t("day"), units: t("days"), seconds: 60 * 60 * 24 },
    { unit: t("hour"), units: t("hours"), seconds: 60 * 60 },
    { unit: t("minute"), units: t("minutes"), seconds: 60 },
    { unit: t("second"), units: t("seconds"), seconds: 1 },
    { unit: t("instant"), units: t("instant"), seconds: 0 },
  ];

  for (const { unit, units, seconds: unitSeconds } of timeUnits) {
    if (seconds >= unitSeconds) {
      const value = Math.floor(seconds / unitSeconds);
      return value + " " + (value !== 1 ? units : unit);
    }
  }
};

export const setupCustomConsole = () => {
  if (!("devAlert" in console)) {
    console.devAlert = message => {
      if (config.mode.development) {
        console.info("%c" + message, "color: red; -webkit-text-stroke: 2px black; font-size: 64px; font-weight: bold;");
      }
    };
  }
};

// date formatting functions
export const localeMap = {
  en: enUS,
  it: it,
  fr: fr,
  de: de,
  es: es,
};

export const getLocaleBasedFormat = (locale) => {
  if (locale.startsWith('en-US')) return 'MMM dd';
  if (locale.startsWith('en') || locale.startsWith('it') || locale.startsWith('de') || locale.startsWith('fr'))
    return 'dd MMM';
  return 'dd MMM'; // Fallback
};

export const formatDate = (date, locale = i18n.language) => {
  return format(date, getLocaleBasedFormat(locale), {
    locale: localeMap[locale] || enUS, // fallback to enUS if locale is unknown
  });
};

export const maxRowsWithinLimit = (dataArray, maxBytes) => {
  let cumulativeSize = 0;
  let maxItems = 0;

  for (let i = 0; i < dataArray.length; i++) {
    try {
      const itemString = JSON.stringify(dataArray[i]);
      const itemSize = new TextEncoder().encode(itemString).length;
      if (cumulativeSize + itemSize > maxBytes) break;
      cumulativeSize += itemSize;
      maxItems++;
    } catch {
      break; // On serialization error, stop counting
    }
  }
  return maxItems;
}

export const base64UrlEncode = (str) => {
  const bytes = new TextEncoder().encode(str);
  const binary = String.fromCharCode(...bytes);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const base64UrlDecode = (str) => {
  const padded = str.padEnd(str.length + (4 - str.length % 4) % 4, "=")
                   .replace(/-/g, "+")
                   .replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)));
  return new TextDecoder().decode(bytes);
};

//import { base64UrlEncode } from "../libs/Misc";

export const bestFitQrPayload = async (jobsArray, maxBytes, encryptFn) => {
  try {
    for (let i = jobsArray.length; i > 0; i--) {
      const slice = jobsArray.slice(0, i);
      const payload = {
        data: null,
        timestamp: Date.now(),
      };

      const toEncrypt = { jobs: slice };
      const encrypted = await encryptFn(toEncrypt);
      payload.data = encrypted;

      const encoded = base64UrlEncode(JSON.stringify(payload));
      const byteLength = new TextEncoder().encode(encoded).length;

      if (byteLength <= maxBytes) {
        return {
          success: true,
          payloadObject: payload,
          encoded,
          truncatedCount: jobsArray.length - i,
          byteLength,
        };
      }
    }

    return {
      success: false,
      reason: "Unable to fit payload within QR byte limit",
      attemptedCount: jobsArray.length,
    };
  } catch (e) {
    return {
      success: false,
      reason: "Failed during export optimization",
      error: e.message,
    };
  }
};

export const isPWA = () => {
  //return window.matchMedia("(display-mode: standalone)").matches;
  return (
    (window.matchMedia('(display-mode: standalone)').matches) ||
    (window.navigator.standalone === true)
  );
};

export const fetchBuildInfoData = async () => {
  return fetch("/build-info.json")
    .then((response) => response.json())
    .then((data) => {
      let d = new Date(data.buildTimestamp);
      data.buildDateTime = // convert timestamp to human readable compact date
        d.getFullYear() + "-" +
        ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("00" + d.getDate()).slice(-2) + " " +
        ("00" + d.getHours()).slice(-2) + ":" +
        ("00" + d.getMinutes()).slice(-2) + ":" +
        ("00" + d.getSeconds()).slice(-2)
        ;
      //setBuildInfo(data);
      //console.log("data:", data);
      return data;
    })
    .catch((error) => {
      console.error("Failed to fetch build info:", error);
      return {};
    })
  ;
};
