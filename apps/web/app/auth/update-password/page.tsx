import React from 'react';

import { UpdatePasswordForm } from '@/components/forms/update-password-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

const Page = () => {
  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-2xl'>Reset Your Password</CardTitle>
        <CardDescription>Please enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <UpdatePasswordForm />
      </CardContent>
    </Card>
  );
};

export default Page;
