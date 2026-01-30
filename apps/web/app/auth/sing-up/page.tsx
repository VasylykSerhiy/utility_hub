import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

import Link from 'next/link';
import SignUpForm from '@/components/forms/sign-up-form';
import { Routes } from '@/constants/router';

const Page = () => {
  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your email and password below to <br />
          create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className='text-muted-foreground mx-auto text-balance px-8 text-center text-sm'>
          Already have an account?
          <Link
            href={Routes.SING_IN}
            className='hover:text-primary ml-1 underline underline-offset-4'
          >
            Sign in
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default Page;
