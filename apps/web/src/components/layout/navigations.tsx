'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type ILink, Routes, links } from '@/constants/router';
import { LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@workspace/ui/lib/utils';

interface INavigationsProps {
  onClick?: (link: ILink) => void;
}

const Navigations = ({ onClick }: INavigationsProps) => {
  const { t } = useTranslation();

  const icons = {
    [Routes.DASHBOARD]: <LayoutGrid />,
  };
  const pathname = usePathname();

  const isActive = (link: string) => pathname === link;

  return (
    <nav className='flex flex-col'>
      {links.map(link => (
        <Link
          href={link.href}
          key={link.href}
          onClick={() => onClick?.(link)}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 font-semibold',
            {
              '': isActive(link.href),
              '': !isActive(link.href),
            },
          )}
        >
          {icons?.[link.href as keyof typeof icons] || null}
          {t(link.title)}
        </Link>
      ))}
    </nav>
  );
};

export default Navigations;
