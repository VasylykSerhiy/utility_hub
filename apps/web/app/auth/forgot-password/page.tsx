'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

import Link from 'next/link';
import { useState } from 'react';
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';
import { Routes } from '@/constants/router';

const Page = () => {
  const [isSuccess, setSuccess] = useState(false);
  return (
    <Card className='gap-4'>
      {isSuccess ? (
        <>
          <CardHeader>
            <CardTitle className='text-2xl'>Check Your Email</CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-sm'>
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className='text-lg tracking-tight'>
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your registered email and <br /> we will send you a link to
              reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm setSuccess={setSuccess} />
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
        </>
      )}
    </Card>
  );
};

export default Page;
