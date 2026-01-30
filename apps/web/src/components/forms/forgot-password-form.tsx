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
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import { type UserForgotPassword, userForgotPassword } from '@workspace/utils';
import { type HTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Routes } from '@/constants/router';
import { createClient } from '@/lib/supabase/client';

interface ForgotPasswordFormProps extends HTMLAttributes<HTMLFormElement> {
  setSuccess: (success: boolean) => void;
}

export function ForgotPasswordForm({
  className,
  setSuccess,
  ...props
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const form = useForm<UserForgotPassword>({
    resolver: zodResolver(userForgotPassword),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: UserForgotPassword) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/${Routes.UPDATE_PASSWORD}`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      form.setError('email', {
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
        <Button className='mt-2' isLoading={isLoading}>
          Send reset link
        </Button>
      </form>
    </Form>
  );
}
