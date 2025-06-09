# Project description

This project implements a complete, full fledged and best practices compliant template of a reactjs spa web app, including full authentication, users handling, and more.

It uses ...

Features include full I18n support, ... 

To add a new language locale support:

 - take note the ISO 639-1 code (2 characters, i.e.: "en", "it", ...) of the language to be added; from here on we indicate it as "XX".
 - create a folder named "XX" in ./src/locales folder.
 - add `"XX"` in locales array in i18next-parser.config.js file.
 - run `yarn i18n`.
 - add `import xx from "./locales/XX/translation.json";` on the top of "src/i18n.js" file, and
       `XX: { translation: XX },` in the resources object some lines below in the same file.
 - translate file "./src/locales/XX/translation.json"

This project was bootstrapped with [yarn create vite](https://vitejs.dev/guide/).

To start:
 - yarn create vite med-client --template react
 - cd med-client
 - yarn
 - yarn dev