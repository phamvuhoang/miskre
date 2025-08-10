import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
}

const buttonVariants = {
  variant: {
    default: 'bg-[var(--seller-primary,_#000)] text-[var(--seller-primary-contrast,_#fff)] hover:bg-[color-mix(in_oklab,var(--seller-primary,_#000),#000_10%)] focus-visible:outline-[var(--seller-primary,_#000)]',
    outline: 'border border-zinc-300 bg-white text-[var(--seller-primary,_#111827)] hover:bg-zinc-50 focus-visible:outline-[var(--seller-primary,_#111827)]',
    ghost: 'bg-transparent text-[var(--seller-primary,_#111827)] hover:bg-zinc-100 focus-visible:outline-[var(--seller-primary,_#111827)]',
    destructive: 'bg-[var(--seller-accent,_#ef4444)] text-[var(--seller-accent-contrast,_#fff)] hover:bg-[color-mix(in_oklab,var(--seller-accent,_#ef4444),#000_10%)] focus-visible:outline-[var(--seller-accent,_#ef4444)]',
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

