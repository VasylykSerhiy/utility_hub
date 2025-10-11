import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import uk from './locales/uk';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
