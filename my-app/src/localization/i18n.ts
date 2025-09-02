import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import ru from "./ru.json";
import kz from "./kz.json";

i18n
  .use(LanguageDetector) // определяет язык автоматически
  .use(initReactI18next) // интеграция с React
  .init({
    fallbackLng: "en", // если язык не найден
    debug: true,        // можно выключить в продакшене
    interpolation: {
      escapeValue: false, // React сам экранирует
    },
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
      kz: {
        translation: kz,
      }
    },
  });

export default i18n;
