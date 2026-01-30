import type { ComponentProps } from 'react';
import { lazy } from 'react';

const Alert = lazy(() => import('./alert'));
const ChangeTariff = lazy(() => import('@/components/modals/change-tariff'));
const CreateMetter = lazy(() => import('@/components/modals/create-meter'));

export const ModalComponents = {
  alertModal: Alert,
  changeTariff: ChangeTariff,
  createMeter: CreateMetter,
} as const;

export type ModalMap = {
  [K in keyof typeof ModalComponents]: ComponentProps<(typeof ModalComponents)[K]>;
};

export type ModalType = keyof ModalMap;
