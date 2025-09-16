import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import LocalStorage from "./libs/LocalStorage";
import config from "./config";

/**
 * All supported languages resources are listed here.
 * When adding a new language, add it here, and in server's config.app.locales.
 */
import en from "./locales/en/translation.json";
import it from "./locales/it/translation.json";
import fr from "./locales/fr/translation.json";

const resources = {
  en: { translation: en },
  it: { translation: it },
  fr: { translation: fr },
};

const initialLocale = LocalStorage.get("preferences")?.locale ?? config.serverLocale;

i18n
  .use(LanguageDetector) // detect language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: initialLocale, // set the initial language
    fallbackLng: initialLocale,
    keySeparator: false, // we do not use keys in form messages.welcome
    nsSeparator: false, // do not use namespaces
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    detection: {
      order: [ "navigator" ], // only detect from browser
      checkWhitelist: true, // only detect languages that are in the whitelist
      caches: [], // avoid `i18nextLng` in local storage
    },
    saveMissing: false, // do not save missing translations in translation_untranslated.json
  //}).then(() => {
    //i18n.locale = (i18n.language || i18n.options.fallbackLng[0]).slice(0, 2).toLowerCase();
    //console.log("LLL i18n - current locale from i18n is", i18n.locale);
  })
;

/**
 * Find the first language from the browser's language, also primarized (ex.: "en_US" => "en") if needed,
 * which is among supported languages; if none found, return configured fallback language.
 */
const getCurrentBrowserLanguage = () => {
  const browserLanguages = i18n.languages;
  //const supportedLanguages = Object.keys(resources);
  const supportedLanguages = Object.keys(config.locales);
  const commonLanguages = browserLanguages.filter(language => supportedLanguages.includes(language));
  if (commonLanguages) { // found a supported language in browser languages
    return commonLanguages[0];
  } else { // not found a supported language in i18n browser languages, look for primary language
    const browserLanguagesPrimary = browserLanguages.map(browserLanguage => browserLanguage.split("_").pop());
    const commonLanguages = browserLanguagesPrimary.filter(language => supportedLanguages.includes(language));
    if (commonLanguages) { // found a supported language in browser primary languages
      return commonLanguages[0];
    } else {
      //return config.i18n.languages.fallback; // return configured fallback language
      return config.serverLocale; // return configured fallback language
    }
  }
};

const getNextSupportedLanguage = () => {
  const locales = Object.keys(config.locales);
  const currentIndex = locales.indexOf(i18n.language);
  const nextIndex = (currentIndex + 1) % locales.length; // find the next index, looping back to 0 if at the end
  //console.log("LLL getNextSupportedLanguage locales[nextIndex]:", locales[nextIndex]);
  return locales[nextIndex];
};

/**
 * Get the most probable country from language code (we let user choose a language, not a country)
 * 
 * @param {*} language 
 * @returns 
 */
const getProbableCountryFromLanguage = (language) => {
  const languageToCountryMap = {
    en: "US", // English → United States
    fr: "FR", // French → France
    es: "ES", // Spanish → Spain
    de: "DE", // German → Germany
    zh: "CN", // Chinese → China
    ja: "JP", // Japanese → Japan
    ru: "RU", // Russian → Russia
    hi: "IN", // Hindi → India
    pt: "BR", // Portuguese → Brazil
    ar: "SA", // Arabic → Saudi Arabia
    it: "IT", // Italian → Italy
    ko: "KR", // Korean → South Korea
    nl: "NL", // Dutch → Netherlands
    tr: "TR", // Turkish → Turkey
    sv: "SE", // Swedish → Sweden
    no: "NO", // Norwegian → Norway
    da: "DK", // Danish → Denmark
    fi: "FI", // Finnish → Finland
    el: "GR", // Greek → Greece
    pl: "PL", // Polish → Poland
    cs: "CZ", // Czech → Czech Republic
    hu: "HU", // Hungarian → Hungary
    th: "TH", // Thai → Thailand
    vi: "VN", // Vietnamese → Vietnam
    id: "ID", // Indonesian → Indonesia
    ms: "MY", // Malay → Malaysia
    fa: "IR", // Persian (Farsi) → Iran
    he: "IL", // Hebrew → Israel
    uk: "UA", // Ukrainian → Ukraine
    ro: "RO", // Romanian → Romania
    bg: "BG", // Bulgarian → Bulgaria
    sr: "RS", // Serbian → Serbia
    hr: "HR", // Croatian → Croatia
    sk: "SK", // Slovak → Slovakia
    lt: "LT", // Lithuanian → Lithuania
    lv: "LV", // Latvian → Latvia
    et: "EE", // Estonian → Estonia
    bn: "BD", // Bengali → Bangladesh
    ta: "LK", // Tamil → Sri Lanka
    te: "IN", // Telugu → India
    mr: "IN", // Marathi → India
    ur: "PK", // Urdu → Pakistan
    sw: "KE", // Swahili → Kenya
    am: "ET", // Amharic → Ethiopia
  };
  return languageToCountryMap[language] || config.ui.locales[config.serverLocale].country;
};

/**
 * Get the most probable phone prefix from language code (we let user choose a language, not a country)
 * 
 * @param {*} language 
 * @returns 
 */
function getProbablePhonePrefixFromLanguage(language) {
  const languageToPhonePrefixMap = {
      en: "+1",   // English → United States
      fr: "+33",  // French → France
      es: "+34",  // Spanish → Spain
      de: "+49",  // German → Germany
      zh: "+86",  // Chinese → China
      ja: "+81",  // Japanese → Japan
      ru: "+7",   // Russian → Russia
      hi: "+91",  // Hindi → India
      pt: "+55",  // Portuguese → Brazil
      ar: "+966", // Arabic → Saudi Arabia
      it: "+39",  // Italian → Italy
      ko: "+82",  // Korean → South Korea
      nl: "+31",  // Dutch → Netherlands
      tr: "+90",  // Turkish → Turkey
      sv: "+46",  // Swedish → Sweden
      no: "+47",  // Norwegian → Norway
      da: "+45",  // Danish → Denmark
      fi: "+358", // Finnish → Finland
      el: "+30",  // Greek → Greece
      pl: "+48",  // Polish → Poland
      cs: "+420", // Czech → Czech Republic
      hu: "+36",  // Hungarian → Hungary
      th: "+66",  // Thai → Thailand
      vi: "+84",  // Vietnamese → Vietnam
      id: "+62",  // Indonesian → Indonesia
      ms: "+60",  // Malay → Malaysia
      fa: "+98",  // Persian (Farsi) → Iran
      he: "+972", // Hebrew → Israel
      uk: "+380", // Ukrainian → Ukraine
      ro: "+40",  // Romanian → Romania
      bg: "+359", // Bulgarian → Bulgaria
      sr: "+381", // Serbian → Serbia
      hr: "+385", // Croatian → Croatia
      sk: "+421", // Slovak → Slovakia
      lt: "+370", // Lithuanian → Lithuania
      lv: "+371", // Latvian → Latvia
      et: "+372", // Estonian → Estonia
      bn: "+880", // Bengali → Bangladesh
      ta: "+94",  // Tamil → Sri Lanka
      te: "+91",  // Telugu → India
      mr: "+91",  // Marathi → India
      ur: "+92",  // Urdu → Pakistan
      sw: "+254", // Swahili → Kenya
      am: "+251", // Amharic → Ethiopia
  };

  return languageToPhonePrefixMap[language] || config.ui.locales[config.serverLocale].phonePrefix;
}

export { i18n, getCurrentBrowserLanguage, getNextSupportedLanguage, getProbableCountryFromLanguage, getProbablePhonePrefixFromLanguage, /*resources*/ };
