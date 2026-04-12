import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';

// All 22 scheduled Indian languages + English
const SUPPORTED_LANGS = new Set([
  'en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa',
  'or', 'as', 'ur', 'sa', 'mai', 'kok', 'doi', 'mni', 'sat',
  'sd', 'ne', 'bo', 'ks',
]);

// Detect browser language, check if supported, fall back to English
const browserLangCode = navigator.language?.split('-')[0] || 'en';
const detectedLang = SUPPORTED_LANGS.has(browserLangCode) ? browserLangCode : 'en';

// Saved preference takes priority over browser detection
const savedLang = localStorage.getItem('fasalrakshak_lang') || detectedLang;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: true,
    },
  });

export default i18n;
