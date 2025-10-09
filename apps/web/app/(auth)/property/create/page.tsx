'use client';

import React from 'react';

import { PropertyCreateForm } from '@/components/forms/property-create-form';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

const Page = () => {
  const { t } = useTranslation();
  return (
    <div className='max-w-md'>
      <Card>
        <CardHeader>
          <CardTitle>{t('PROPERTY.CREATE.TITLE')}</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyCreateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
