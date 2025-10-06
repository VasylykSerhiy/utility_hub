'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UserForgotPassword, userForgotPassword } from '@workspace/utils';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

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

export function ForgotPasswordForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserForgotPassword>({
    resolver: zodResolver(userForgotPassword),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: UserForgotPassword) => {
    setIsLoading(true);
    console.log(data);
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
        <Button className='mt-2' disabled={isLoading}>
          Continue
          {isLoading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
        </Button>
      </form>
    </Form>
  );
}
