'use client';

import { Button, type ButtonProps } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { cn } from '@workspace/ui/lib/utils';
import { MoreHorizontalIcon } from 'lucide-react';

export interface DropdownActionsProps {
  actions: ButtonProps[];
}

export function DropdownActions({ actions }: DropdownActionsProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' aria-label='Open menu'>
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='flex flex-col gap-0.5'>
        {actions.map(({ className, ...action }, index) => (
          <DropdownMenuItem
            key={
              typeof action.children === 'string'
                ? action.children
                : `action-${index}`
            }
            asChild
          >
            <Button
              {...action}
              className={cn('w-full justify-start', className)}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
