import { LayoutGrid, LucideIcon, TableProperties } from 'lucide-react';

export interface ILink {
  title: string;
  href: string;
  icon?: LucideIcon;
}

export const Routes = {
  DASHBOARD: '/dashboard',
  PROPERTY: '/property',
  SING_IN: '/sing-in',
  SING_UP: '/sing-up',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email',
} as const;

export const links: ILink[] = [
  { title: 'MENU.LINK.DASHBOARD', href: Routes.DASHBOARD, icon: LayoutGrid },
  { title: 'MENU.LINK.PROPERTY', href: Routes.PROPERTY, icon: TableProperties },
];
