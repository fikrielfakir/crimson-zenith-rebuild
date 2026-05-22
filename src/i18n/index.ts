import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import es from "./locales/es.json";

const applyDir = (lng: string) => {
  // Admin panel manages its own direction independently — don't interfere
  if (window.location.pathname.startsWith("/admin")) return;
  const isRTL = lng === "ar";
  document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", lng);
};

// Register BEFORE init so the initial language-change event is caught
i18n.on("languageChanged", applyDir);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
      es: { translation: es },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "ar", "es"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "tja_language",
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Belt-and-suspenders: apply immediately after init in case the event
// already fired synchronously before the listener was attached
if (i18n.language) {
  applyDir(i18n.language);
}

export default i18n;
