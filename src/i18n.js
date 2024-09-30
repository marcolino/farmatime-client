import i18n from "i18next";
import { initReactI18next } from "react-i18next";
//import moment from "moment";
import LanguageDetector from "i18next-browser-languagedetector";
import config from "./config";

import en from "./locales/en/translation.json";
import it from "./locales/it/translation.json";
import fr from "./locales/fr/translation.json";

/**
 * All supported languages resources are listed here.
 * When adding a new language, add it here.
 */
const resources = {
  en: { translation: en },
  it: { translation: it },
  fr: { translation: fr },
};

i18n
  .use(LanguageDetector) // detect language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: [ config.i18n.languages.fallback ],
    keySeparator: false, // we do not use keys in form messages.welcome
    nsSeparator: false, // do not use namespaces
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    detection: {
      order: [ "navigator" ], // only detect from browser
      checkWhitelist: true, // only detect languages that are in the whitelist
    },
  }).then(() => {
    const currentLanguage = i18n.language || i18n.options.fallbackLng[0];
    //moment.locale(currentLanguage); // set the initial locale for Moment.js
  })
;

export { i18n, resources };
