'use client';

import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export enum Emodal {
  MobileMenu = 'mobile-menu',
  CrateMeter = 'create-meter',
  ChangeTariff = 'change-tariff',
}

interface IArgs {
  id?: string;
}

type State = {
  args: IArgs;
  open: null | Emodal;
  openModal: (modal: Emodal, args?: Partial<IArgs>) => void;
  setArgs: (args: Partial<IArgs>) => void;
  closeModal: () => void;
};

export const useModalStateStore = createWithEqualityFn<State>(
  set => ({
    open: null,
    args: {},
    openModal: (modal: Emodal, args = {}) => set({ open: modal, args }),
    setArgs: args => set(state => ({ args: { ...state.args, ...args } })),
    closeModal: () => set({ open: null }),
  }),
  shallow,
);

export const useModalState = <T>(selector: (state: State) => T) =>
  useModalStateStore(selector, shallow);
