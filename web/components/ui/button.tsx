import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
}

const buttonVariants = {
  variant: {
    default: 'bg-black text-white hover:bg-zinc-800 focus-visible:outline-black',
    outline: 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 focus-visible:outline-zinc-900',
    ghost: 'bg-transparent text-zinc-900 hover:bg-zinc-100 focus-visible:outline-zinc-900',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
  },
  size: {
    sm: 'px-3 py-1.5 text-xs',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  },
};

export function Button({
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium shadow-sm transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        // Variant styles
        buttonVariants.variant[variant],
        // Size styles
        buttonVariants.size[size],
        className
      )}
      {...props}
    />
  );
}

