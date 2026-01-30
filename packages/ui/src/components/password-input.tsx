'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  ref?: React.Ref<HTMLInputElement>;
};

export function PasswordInput({
  className,
  disabled,
  ref,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={cn('relative rounded-md', className)}>
      <Input
        type={showPassword ? 'text' : 'password'}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      <Button
        type='button'
        size='icon'
        variant='ghost'
        disabled={disabled}
        className='text-muted-foreground absolute end-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md'
        onClick={() => setShowPassword(prev => !prev)}
      >
        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
      </Button>
    </div>
  );
}
