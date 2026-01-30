'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';

import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { links } from '@/constants/router';
import { useLanguage } from '@/providers/language-provider';

import { ThemeToggleButton } from './theme-toggle-button';

const Header = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const pathname = usePathname();

  const title = links.find(link => link.href === pathname)?.title ?? '';

  return (
    <div className='bg-background top-14 z-10 hidden h-[52px] w-full items-center justify-between px-4 lg:sticky lg:top-0 lg:ml-[280px] lg:mr-[280px] lg:flex lg:h-[72px] lg:w-[calc(100%-280px)] lg:px-6'>
      <h1 className='text:lg hover:text-accent font-semibold lg:text-2xl'>
        {t(title)}
      </h1>
      <div className='flex gap-4'>
        <Select onValueChange={changeLanguage} value={language}>
          <SelectTrigger className='gap-0.5 rounded-full px-3 py-1 font-medium max-lg:hidden'>
            <SelectValue placeholder='' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='en'>ENG</SelectItem>
            <SelectItem value='uk'>UKR</SelectItem>
          </SelectContent>
        </Select>
        <ThemeToggleButton />
        <ProfileDropdown />
      </div>
    </div>
  );
};

export default Header;
