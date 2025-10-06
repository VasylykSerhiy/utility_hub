'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Routes } from '@/constants/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserCreateShema, userCreateShema } from '@workspace/utils';
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

import { singUpAction } from '../../../app/(login)/_actions';

export function SignUpForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<UserCreateShema>({
    resolver: zodResolver(userCreateShema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async ({ email, password }: UserCreateShema) => {
    setIsLoading(true);
    const { data, error } = await singUpAction({ email, password });
    if (error) {
      toast.error(error.message, { duration: 50000 });
      setIsLoading(false);
      return;
    }
    router.push(Routes.VERIFY_EMAIL);
    console.log(data);
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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Create Account
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
          <Button variant='outline' className='w-full' type='button' disabled={isLoading}>
            GitHub
          </Button>
          <Button variant='outline' className='w-full' type='button' disabled={isLoading}>
            Facebook
          </Button>
        </div>
      </form>
    </Form>
  );
}
