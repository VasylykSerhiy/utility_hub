'use client';

import * as React from 'react';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@workspace/ui/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
    icon?: React.ReactNode;
    thumbClassName?: string;
  }
>(({ className, icon, thumbClassName, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      'shadow-xs focus-visible:outline-hidden focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'bg-background pointer-events-none flex h-4 w-4 items-center justify-center rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        thumbClassName,
      )}
    >
      {icon ? icon : null}
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
));
export { Switch };
