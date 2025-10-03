'use client';

import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import i18n from '@workspace/i18n/i18n';
import { Language } from '@workspace/types';

export const LanguageContext = createContext<
  | {
      language: Language;
      changeLanguage: (lang: Language) => void;
    }
  | undefined
>(undefined);

export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const cookieLang = document.cookie.match(/i18next=(\w+)/)?.[1] ?? 'en';
    if (i18n.language !== cookieLang) {
      i18n.changeLanguage(cookieLang).then(() => setLanguage(cookieLang as Language));
    } else {
      setLanguage(cookieLang as Language);
    }
    setIsMounted(true);
  }, []);

  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang).then(() => {
      setLanguage(lang);
      document.cookie = `i18next=${lang}; path=/;`;
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
