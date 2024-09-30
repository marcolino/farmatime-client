import moment from "moment";
import { i18n } from "../i18n";

export const setMomentLocale = async (language) => {
  try {
    await import(/* @vite-ignore */ `moment/locale/${language}`);
    moment.locale(language);
  } catch (e) {
    console.warn(`Moment locale for ${language} not found, using default`);
    moment.locale(config.i18n.languages.fallback);
  }
};

// set the initial locale on app start
setMomentLocale(i18n.language || i18n.options.fallbackLng[0]);

// Listen for language changes to update moment locale
i18n.on("languageChanged", (language) => {
  setMomentLocale(language);
});

// import moment from "moment";
// import { i18n }  from "../i18n";

// export const getLocalizedMoment = async () => {
//   const currentLanguage = i18n.language || i18n.options.fallbackLng[0];

//   try {
//     await import(/* @vite-ignore */ `moment/locale/${currentLanguage}`);
//     moment.locale(currentLanguage);
//   } catch (e) {
//     const fallbackLanguage = config.i18n.languages.fallback;
//     console.warn(`Moment locale file for ${currentLanguage} not found, using default ${{fallbackLanguage}}`);
//     moment.locale("fallbackLanguage"); // TODO...
//   }

//   return moment;
// };