import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-[#1971c2] text-white hover:bg-[#1864ab] focus:ring-[#1971c2]',
        outline:
          'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
        destructive: 'bg-[#fa5252] text-white hover:bg-[#f03e3e] focus:ring-[#fa5252]',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-4 py-2 text-base',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant, size, children, ...props }, ref) => {
    return (
      <button ref={ref} className={buttonVariants({ variant, size, className })} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
