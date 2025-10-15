import React, { PropsWithChildren } from 'react';

import ChangeTariff from '@/components/modals/change-tariff';
import CreateMeter from '@/components/modals/create-meter';
import { Emodal, useModalState } from '@/stores/use-modal-state';

const ModalsProvider = ({ children }: PropsWithChildren) => {
  const open = useModalState(state => state.open);

  return (
    <>
      {open === Emodal.CrateMeter && <CreateMeter />}
      {open === Emodal.ChangeTariff && <ChangeTariff />}
      {children}
    </>
  );
};

export default ModalsProvider;
