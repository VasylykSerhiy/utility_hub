import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

import Link from 'next/link';
import { UserAuthForm } from '@/components/forms/user-auth-form';
import { Routes } from '@/constants/router';

const Page = () => {
  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password below to <br />
          log into your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserAuthForm />
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
