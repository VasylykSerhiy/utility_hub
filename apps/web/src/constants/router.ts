import { LayoutGrid, LucideIcon, TableProperties } from 'lucide-react';

export interface ILink {
  title: string;
  href: string;
  icon?: LucideIcon;
}

export const Routes = {
  DASHBOARD: '/dashboard',
  PROPERTY: '/property',
  SING_IN: '/auth/sing-in',
  SING_UP: '/auth/sing-up',
  SING_UP_SUCCESS: '/auth/sing-up-success',
  FORGOT_PASSWORD: '/auth/forgot-password',
  UPDATE_PASSWORD: 'auth/update-password',
} as const;

export const links: ILink[] = [
  { title: 'MENU.LINK.DASHBOARD', href: Routes.DASHBOARD, icon: LayoutGrid },
  { title: 'MENU.LINK.PROPERTY', href: Routes.PROPERTY, icon: TableProperties },
];
