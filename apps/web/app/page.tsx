'use client';

import GetTest from '@/components/get-test';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();
  return (
    <main className='mx-auto max-w-4xl p-8'>
      <header className='mb-12 text-center'>
        <h1 className='mb-4 text-3xl font-bold'>{t('CONTRACT_EVENT.BORROW')}</h1>
        <p className='text-muted-foreground'>
          This demo shows the integration between different packages in our monorepo: UI components,
          API connectivity, and shared types.
        </p>
      </header>

      <div className='space-y-8'>
        <section>
          <h2 className='mb-4 text-xl font-semibold'>API Integration Demo</h2>
          <GetTest />
        </section>
      </div>
    </main>
  );
}
