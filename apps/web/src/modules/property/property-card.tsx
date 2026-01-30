'use client';

import type { IProperty } from '@workspace/types';
import { Button } from '@workspace/ui/components/button';
import { Card, CardFooter } from '@workspace/ui/components/card';
import domtoimage from 'dom-to-image';
import { Camera } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Routes } from '@/constants/router';
import PropertyLastMonthDetail from '@/modules/property/property-last-month-detail';
import { useModalStore } from '@/stores/use-modal-state';

export function PropertyCard({ lastReading, name, id }: IProperty) {
  const { t } = useTranslation();
  const blockRef = useRef<HTMLDivElement>(null);
  const openModal = useModalStore(s => s.openModal);

  const handleScreenshot = async () => {
    if (!blockRef.current) return;

    try {
      const originalBlock = blockRef.current;
      const clonedBlock = originalBlock.cloneNode(true) as HTMLElement;

      clonedBlock.querySelectorAll('button').forEach(btn => {
        btn.style.visibility = 'hidden';
      });

      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = `${originalBlock.offsetWidth}px`;
      container.style.height = `${originalBlock.offsetHeight}px`;
      container.appendChild(clonedBlock);
      document.body.appendChild(container);

      const dataUrl = await domtoimage.toPng(clonedBlock);
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);

      document.body.removeChild(container);

      toast.success(t('SCREENSHOT.SUCCESS'));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      ref={blockRef}
      className='group relative justify-between border shadow-lg transition-shadow duration-300 hover:shadow-xl'
    >
      <Button
        variant='outline'
        size='icon'
        className='absolute right-6 top-14 z-10 mx-auto hidden text-center group-hover:flex'
        onClick={handleScreenshot}
      >
        <Camera />
      </Button>

      <PropertyLastMonthDetail name={name} lastReading={lastReading} />
      <CardFooter>
        <div className='grid w-full grid-cols-2 gap-2'>
          <Link href={`${Routes.PROPERTY}/${id}`}>
            <Button className='w-full'>{t('BUTTONS.MORE')}</Button>
          </Link>
          <Button
            onClick={e => {
              e.stopPropagation();
              openModal('createMeter', { id });
            }}
            className='w-full'
          >
            {t('BUTTONS.ADD_METER')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
