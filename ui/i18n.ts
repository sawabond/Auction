import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './src/locales/en/en.json';
import uaTranslation from './src/locales/ua/ua.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  ua: {
    translation: uaTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
