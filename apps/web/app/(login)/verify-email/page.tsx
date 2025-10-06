import React from 'react';

import { Card, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';

const Page = () => {
  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>Check Your Email</CardTitle>
        <CardDescription>
          We have sent you an email with a code to verify your email address.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default Page;
