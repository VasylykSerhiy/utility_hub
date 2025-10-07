'use client';

import * as React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { LanguageProvider } from '@/providers/language-provider';
import QueryProvider from '@/providers/query-provider';

import { Toaster } from '@workspace/ui/components/sonner';

export function Provides({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NextThemesProvider attribute='class' defaultTheme='system' enableSystem enableColorScheme>
        <Toaster />
        <LanguageProvider>{children}</LanguageProvider>
      </NextThemesProvider>
    </QueryProvider>
  );
}
