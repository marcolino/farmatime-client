import React, { createContext, useContext, useState, useEffect } from "react";
import moment from "moment/min/moment-with-locales";
//import moment from "moment"; // TODO: import all needed locales... (!!!)
// import "moment/locale/it";
// import "moment/locale/fr";
// import "moment/locale/en";
import { i18n }  from "../i18n";
import config from "../config";

const MomentContext = createContext();

export const MomentProvider = ({ children }) => {
  const [localizedMoment, setLocalizedMoment] = useState(moment);

  useEffect(() => {
    const updateMomentLocale = async (language) => {
      try {
        // dynamically import the moment locale for the language
        await import(/* @vite-ignore */ `moment/locale/${language}`);
        moment.locale(language);
        setLocalizedMoment(() => moment); // update the context state
      } catch (e) { // fallback to default
        console.warn(`Moment locale for ${language} not found, using default`);
        moment.locale(config.i18n.languages.fallback);
        setLocalizedMoment(() => moment);
      }
    };

    // set initial locale
    updateMomentLocale(i18n.language || i18n.options.fallbackLng[0]);

    // listen for language changes and update locale
    i18n.on("languageChanged", (language) => {
      updateMomentLocale(language);
    });

    // cleanup listener
    return () => i18n.off("languageChanged");
  }, []);

  return (
    <MomentContext.Provider value={localizedMoment}>
      {children}
    </MomentContext.Provider>
  );
};

export const useMoment = () => useContext(MomentContext);
