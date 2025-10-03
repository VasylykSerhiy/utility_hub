import React from 'react';

import Link from 'next/link';

import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';
import { Routes } from '@/constants/router';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

const Page = () => {
  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>Forgot Password</CardTitle>
        <CardDescription>
          Enter your registered email and <br /> we will send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter>
        <p className='text-muted-foreground mx-auto text-balance px-8 text-center text-sm'>
          Don't have an account?
          <Link
            href={Routes.SING_UP}
            className='hover:text-primary ml-1 underline underline-offset-4'
          >
            Sign up
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default Page;
