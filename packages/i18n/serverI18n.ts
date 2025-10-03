import { createInstance } from 'i18next';

import en from './locales/en';
import uk from './locales/uk';

export async function getServerT(locale: string) {
  const instance = createInstance();

  await instance.init({
    lng: locale,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      uk: { translation: uk },
    },
    interpolation: {
      escapeValue: false,
    },
  });

  return instance.t;
}
