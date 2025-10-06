export interface ILink {
  title: string;
  href: string;
}

export const Routes = {
  DASHBOARD: '/dashboard',
  SING_IN: '/sing-in',
  SING_UP: '/sing-up',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email',
} as const;

export const links: ILink[] = [{ title: 'MENU.LINK.DASHBOARD', href: Routes.DASHBOARD }];
