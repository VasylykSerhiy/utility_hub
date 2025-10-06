'use client';

import { HTMLAttributes, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Routes } from '@/constants/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserAuthShema, userAuthShema } from '@workspace/utils';
import { Loader2, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { PasswordInput } from '@workspace/ui/components/password-input';
import { cn } from '@workspace/ui/lib/utils';

import { resendVerificationEmailAction, singInAction } from '../../../app/(login)/_actions';

interface UserAuthFormProps extends HTMLAttributes<HTMLFormElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<UserAuthShema>({
    resolver: zodResolver(userAuthShema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async ({ email, password }: UserAuthShema) => {
    setIsLoading(true);
    const { error } = await singInAction({ email, password });

    if (error) {
      if (error.message === 'Email not confirmed') {
        await resendVerificationEmailAction(email);
        router.push(Routes.VERIFY_EMAIL);
        return;
      }

      setIsLoading(false);
      toast.error(error.message, { duration: 1000 });
      return;
    }

    router.push(Routes.DASHBOARD);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                href='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 end-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-card text-muted-foreground px-2'>Or continue with</span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading}>
            GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            Facebook
          </Button>
        </div>
      </form>
    </Form>
  );
}
