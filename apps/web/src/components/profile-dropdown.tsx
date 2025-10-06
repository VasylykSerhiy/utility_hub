import { useRouter } from 'next/navigation';

import { Routes } from '@/constants/router';

import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';

import { singOutAction } from '../../app/(login)/_actions';

export function ProfileDropdown() {
  const router = useRouter();

  const handleSignOut = async () => {
    await singOutAction();
    router.push(Routes.SING_IN);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative size-9 rounded-full'>
            <Avatar className='size-9'>
              <AvatarFallback>SN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm font-medium leading-none'>satnaing</p>
              <p className='text-muted-foreground text-xs leading-none'>satnaingdev@gmail.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            Sign out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
