import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enGame from "./locales/en/game.json";
import heCommon from "./locales/he/common.json";
import heGame from "./locales/he/game.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, game: enGame },
    he: { common: heCommon, game: heGame },
  },
  lng: "en",
  fallbackLng: "en",
  ns: ["common", "game"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
