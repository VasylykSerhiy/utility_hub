import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';

interface ILogoProps {
  className?: string;
  size?: number;
  color?: string;
}

const Logo = ({ size = 64, className }: ILogoProps) => {
  return (
    <Link href='/'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={size}
        viewBox='0 0 220 64'
        className={cn(className)}
        aria-label='UtilityHub logo'
        role='img'
      >
        <rect x='0' y='0' width='64' height='64' rx='12' fill='#61bc84' />

        <circle cx='32' cy='32' r='14' fill='#FFFFFF' />

        <path
          d='M22 36 Q27 30 32 36 T42 36'
          stroke='#61bc84'
          strokeWidth='3'
          fill='none'
        />

        <circle cx='26' cy='28' r='2' fill='#4CA86C' />
        <circle cx='32' cy='28' r='2' fill='#61bc84' />
        <circle cx='38' cy='28' r='2' fill='#82D78C' />

        <text
          x='80'
          y='40'
          fontFamily='Arial, sans-serif'
          fontSize='24'
          fill='#61bc84'
          fontWeight='bold'
        >
          UtilityHub
        </text>
      </svg>
    </Link>
  );
};

export default Logo;
