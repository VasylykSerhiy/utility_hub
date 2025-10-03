'use client';

import * as React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { LanguageProvider } from '@/providers/language-provider';

export function Provides({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <LanguageProvider>{children}</LanguageProvider>
    </NextThemesProvider>
  );
}
