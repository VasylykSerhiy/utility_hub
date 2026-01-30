import { cn } from '@workspace/ui/lib/utils';
import type React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {}

const Svg = ({ className, children, ...props }: IconProps) => {
  return (
    <svg
      aria-label='Svg icon'
      role='img'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className={cn(className)}
      {...props}
    >
      {children}
    </svg>
  );
};

export default Svg;
