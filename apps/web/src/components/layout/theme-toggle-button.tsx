import React from 'react';

import { useTheme } from 'next-themes';

import { MoonIcon, SunMediumIcon } from 'lucide-react';

import { Switch } from '@workspace/ui/components/switch';

export const ThemeToggleButton: React.FC = () => {
  const { setTheme, theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Switch
      icon={isDarkMode ? <MoonIcon className='h-5 w-5' /> : <SunMediumIcon className='h-5 w-5' />}
      checked={isDarkMode}
      onCheckedChange={() => setTheme(ps => (ps === 'dark' ? 'light' : 'dark'))}
      className='w-15 h-9'
      thumbClassName='h-8 w-8 data-[state=checked]:translate-x-6  flex items-center justify-center transition-all duration-2000'
    />
  );
};
