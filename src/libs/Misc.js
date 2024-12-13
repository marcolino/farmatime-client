import React from "react";
import config from "../config";


export const isEmptyObject = (obj) => {
  return (
    obj ? // null and undefined check
      Object.keys(obj).length === 0 // empty object check
      && obj.constructor === Object // Object.keys(new Date()).length === 0; so we have to check it is not a Date
    :
      true
  );
};

export const isNull = (v) => {
  return (v == null);
}

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
}

export const objectsAreEqual = (o1, o2) => {
  // return Object.keys(o1).length === Object.keys(o2).length
  //   && Object.keys(o1).every(p => o1[p] === o2[p])
  // ;
  const retval = Object.keys(o1).length === Object.keys(o2).length
    && Object.keys(o1).every(p => o1[p] === o2[p])
    ;
  return retval;
} 

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
}

// check if consent is expired
const cookiesIsConsentExpired = (timestamp) => {
  const expirationTimeMilliseconds = config.cookies.expirationDays * 24 * 60 * 60 * 1000; // approximately one year
  return new Date().getTime() > (timestamp + expirationTimeMilliseconds);
};

// load consent from localStorage
export const cookiesLoadConsent = () => {
  const storedData = localStorage.getItem(config.cookies.key);
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    if (!cookiesIsConsentExpired(parsedData.timestamp)) {
      // setIsConsentGiven(parsedData.consent);
      // setProfilingConsent(parsedData.consent.profiling);
      // setStatisticsConsent(parsedData.consent.statistics);
      // return;
      return {
        technical: true,
        profiling: parsedData.consent.profiling,
        statistics: parsedData.consent.statistics,
      };
    }
    // consent expired, remove it
    localStorage.removeItem(config.cookies.key);
  }
  //setIsConsentGiven(null); // trigger consent modal display
  return null;
};

// save consent to localStorage with current timestamp
export const cookiesSaveConsent = (newConsent) => {
  const consentData = {
    consent: newConsent,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(config.cookies.key, JSON.stringify(consentData));
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
}

export const diacriticMatchRegex = (string = "", exact = false) => {
  const diacriticMap = {
    "a": "[a,á,à,ä,â,ã,å,ā,ă,ą]",
    "A": "[A,Á,À,Ä,Â,Ã,Å,Ā,Ă,Ą]",
    "c": "[c,ç,ć,č,ĉ]",
    "C": "[C,Ç,Ć,Č,Ĉ]",
    "d": "[d,đ,ď]",
    "D": "[D,Đ,Ď]",
    "e": "[e,é,è,ë,ê,ē,ĕ,ė,ę,ě]",
    "E": "[E,É,È,Ë,Ê,Ē,Ĕ,Ė,Ę,Ě]",
    "g": "[g,ğ,ĝ,ġ,ģ]",
    "G": "[G,Ğ,Ĝ,Ġ,Ģ]",
    "h": "[h,ĥ,ħ]",
    "H": "[H,Ĥ,Ħ]",
    "i": "[i,í,ì,ï,î,ī,ĭ,į,ı]",
    "I": "[I,Í,Ì,Ï,Î,Ī,Ĭ,Į,İ]",
    "j": "[j,ĵ]",
    "J": "[J,Ĵ]",
    "k": "[k,ķ]",
    "K": "[K,Ķ]",
    "l": "[l,ĺ,ļ,ľ,ŀ,ł]",
    "L": "[L,Ĺ,Ļ,Ľ,Ŀ,Ł]",
    "n": "[n,ñ,ń,ņ,ň,ŉ]",
    "N": "[N,Ñ,Ń,Ņ,Ň]",
    "o": "[o,ó,ò,ö,ô,õ,ō,ŏ,ő]",
    "O": "[O,Ó,Ò,Ö,Ô,Õ,Ō,Ŏ,Ő]",
    "r": "[r,ŕ,ř,ŗ]",
    "R": "[R,Ŕ,Ř,Ŗ]",
    "s": "[s,ś,š,ş,ŝ]",
    "S": "[S,Ś,Š,Ş,Ŝ]",
    "t": "[t,ţ,ť,ŧ]",
    "T": "[T,Ţ,Ť,Ŧ]",
    "u": "[u,ü,ú,ù,û,ū,ŭ,ů,ű,ų]",
    "U": "[U,Ü,Ú,Ù,Û,Ū,Ŭ,Ů,Ű,Ų]",
    "w": "[w,ŵ]",
    "W": "[W,Ŵ]",
    "y": "[y,ý,ÿ,ŷ]",
    "Y": "[Y,Ý,Ÿ,Ŷ]",
    "z": "[z,ź,ž,ż]",
    "Z": "[Z,Ź,Ž,Ż]"
  };
  return string.replace(/./g, (char) => (exact ? "^" : "") + (diacriticMap[char] || char) + (exact ? "$" : ""));
}

export const encodeEmail = (email) => {
  let encodedEmail = "";
  
  if (!email) {
    return "";
  }

  for (let i = 0; i < email.length; i++) {
    let charNum = "000";
    let curChar = email.charAt(i);
    if (curChar === "A") charNum = "065";
    if (curChar === "a") charNum = "097";
    if (curChar === "B") charNum = "066";
    if (curChar === "b") charNum = "098";
    if (curChar === "C") charNum = "067";
    if (curChar === "c") charNum = "099";
    if (curChar === "D") charNum = "068";
    if (curChar === "d") charNum = "100";
    if (curChar === "E") charNum = "069";
    if (curChar === "e") charNum = "101";
    if (curChar === "F") charNum = "070";
    if (curChar === "f") charNum = "102";
    if (curChar === "G") charNum = "071";
    if (curChar === "g") charNum = "103";
    if (curChar === "H") charNum = "072";
    if (curChar === "h") charNum = "104";
    if (curChar === "I") charNum = "073";
    if (curChar === "i") charNum = "105";
    if (curChar === "J") charNum = "074";
    if (curChar === "j") charNum = "106";
    if (curChar === "K") charNum = "075";
    if (curChar === "k") charNum = "107";
    if (curChar === "L") charNum = "076";
    if (curChar === "l") charNum = "108";
    if (curChar === "M") charNum = "077";
    if (curChar === "m") charNum = "109";
    if (curChar === "N") charNum = "078";
    if (curChar === "n") charNum = "110";
    if (curChar === "O") charNum = "079";
    if (curChar === "o") charNum = "111";
    if (curChar === "P") charNum = "080";
    if (curChar === "p") charNum = "112";
    if (curChar === "Q") charNum = "081";
    if (curChar === "q") charNum = "113";
    if (curChar === "R") charNum = "082";
    if (curChar === "r") charNum = "114";
    if (curChar === "S") charNum = "083";
    if (curChar === "s") charNum = "115";
    if (curChar === "T") charNum = "084";
    if (curChar === "t") charNum = "116";
    if (curChar === "U") charNum = "085";
    if (curChar === "u") charNum = "117";
    if (curChar === "V") charNum = "086";
    if (curChar === "v") charNum = "118";
    if (curChar === "W") charNum = "087";
    if (curChar === "w") charNum = "119";
    if (curChar === "X") charNum = "088";
    if (curChar === "x") charNum = "120";
    if (curChar === "Y") charNum = "089";
    if (curChar === "y") charNum = "121";
    if (curChar === "Z") charNum = "090";
    if (curChar === "z") charNum = "122";
    if (curChar === "0") charNum = "048";
    if (curChar === "1") charNum = "049";
    if (curChar === "2") charNum = "050";
    if (curChar === "3") charNum = "051";
    if (curChar === "4") charNum = "052";
    if (curChar === "5") charNum = "053";
    if (curChar === "6") charNum = "054";
    if (curChar === "7") charNum = "055";
    if (curChar === "8") charNum = "056";
    if (curChar === "9") charNum = "057";
    if (curChar === "&") charNum = "038";
    if (curChar === " ") charNum = "032";
    if (curChar === "_") charNum = "095";
    if (curChar === "-") charNum = "045";
    if (curChar === "@") charNum = "064";
    if (curChar === ".") charNum = "046";
    if (charNum === "000") {
      encodedEmail += curChar;
    } else {
      encodedEmail += "&#" + charNum + ";";
    }
  }
  return React.createElement("span", { dangerouslySetInnerHTML: { __html: encodedEmail } });
}
