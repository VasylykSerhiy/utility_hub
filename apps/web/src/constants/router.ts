export interface ILink {
  title: string;
  href: string;
}

export const Routes = {
  DASHBOARD: '/',
} as const;

export const links: ILink[] = [{ title: 'MENU.LINK.DASHBOARD', href: Routes.DASHBOARD }];
