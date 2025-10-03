'use client';

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export enum Emodal {
  ComingSoon = 'coming-soon',
  MobileMenu = 'mobile-menu',
}

export enum EStatus {
  Confirm = 'confirm',
  Success = 'success',
  Pending = 'pending',
  Failed = 'failed',
}

interface IArgs {
  status?: EStatus;
  isin?: string;
  nftId?: string;
  amount?: string;
  issuer?: string;
  currentAllowance?: number;
  totalAllowance?: number;
}

type State = {
  args: IArgs;
  open: null | Emodal;
  openComingSoon: () => void;
  openModal: (modal: Emodal, args?: Partial<IArgs>) => void;
  setArgs: (args: Partial<IArgs>) => void;
  closeModal: () => void;
};

export const useModalStateStore = createWithEqualityFn<State>(
  set => ({
    open: null,
    args: {},
    openComingSoon: () => set({ open: Emodal.ComingSoon }),
    openModal: (modal: Emodal, args = {}) => set({ open: modal, args }),
    setArgs: args => set(state => ({ args: { ...state.args, ...args } })),
    closeModal: () => set({ open: null }),
  }),
  shallow,
);

export const useModalState = <T>(selector: (state: State) => T) =>
  useModalStateStore(selector, shallow);
