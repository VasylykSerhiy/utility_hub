'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type ILink, links } from '@/constants/router';
import { useTranslation } from 'react-i18next';

import { cn } from '@workspace/ui/lib/utils';

interface INavigationsProps {
  onClick?: (link: ILink) => void;
}

const Navigations = ({ onClick }: INavigationsProps) => {
  const { t } = useTranslation();

  const pathname = usePathname();

  const isActive = (link: string) => pathname.startsWith(link);

  return (
    <nav className='flex flex-col px-4'>
      {links.map(link => (
        <Link
          href={link.href}
          key={link.href}
          onClick={() => onClick?.(link)}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 font-semibold transition',
            {
              'bg-primary': isActive(link.href),
              '': !isActive(link.href),
            },
          )}
        >
          {link.icon && <link.icon size={20} />}
          {t(link.title)}
        </Link>
      ))}
    </nav>
  );
};

export default Navigations;
