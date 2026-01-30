'use client';

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
import { PasswordInput } from '@workspace/ui/components/password-input';
import { cn } from '@workspace/ui/lib/utils';
import { type UserUpdatePassword, userUpdatePassword } from '@workspace/utils';
import { useRouter } from 'next/navigation';
import { type HTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Routes } from '@/constants/router';
import { createClient } from '@/lib/supabase/client';

interface UpdatePasswordFormProps extends HTMLAttributes<HTMLFormElement> {}

export function UpdatePasswordForm({
  className,
  ...props
}: UpdatePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const supabase = createClient();

  const form = useForm<UserUpdatePassword>({
    resolver: zodResolver(userUpdatePassword),
    defaultValues: { password: '' },
  });

  const onSubmit = async ({ password }: UserUpdatePassword) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      push(Routes.DASHBOARD);
    } catch (error: unknown) {
      form.setError('password', {
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
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
        <Button className='mt-2' isLoading={isLoading}>
          Update
        </Button>
      </form>
    </Form>
  );
}
