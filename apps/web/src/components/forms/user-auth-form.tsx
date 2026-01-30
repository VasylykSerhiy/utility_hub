'use client';

import { type HTMLAttributes, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { type UserAuthShema, userAuthShema } from '@workspace/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import GoogleButton from '@/components/forms/components/google-button';
import { Routes } from '@/constants/router';
import { useAuthUser } from '@/hooks/use-user';
import { createClient } from '@/lib/supabase/client';

interface UserAuthFormProps extends HTMLAttributes<HTMLFormElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { mutateAsync } = useAuthUser();
  const supabase = createClient();

  const form = useForm<UserAuthShema>({
    resolver: zodResolver(userAuthShema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async ({ email, password }: UserAuthShema) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data?.session.access_token) {
        setIsLoading(false);
        toast.error('Something went wrong, please try again.');
        return;
      }

      await mutateAsync({ token: data?.session.access_token });

      router.push(Routes.DASHBOARD);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An error occurred', { duration: 1000 });
    } finally {
      setIsLoading(false);
    }
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
                href={Routes.FORGOT_PASSWORD}
                className='text-muted-foreground absolute -top-0.5 end-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' isLoading={isLoading}>
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

        <div className='grid grid-cols-1'>
          <GoogleButton />
        </div>
      </form>
    </Form>
  );
}
