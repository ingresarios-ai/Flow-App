import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-surface border border-border/50 rounded-2xl p-4 mb-3 relative overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  return (
    <button
      className={cn(
        'block w-full text-center p-3.5 rounded-xl border-none cursor-pointer font-montserrat font-bold text-[18px] tracking-wide uppercase transition-transform active:scale-95 mt-2',
        variant === 'primary' && 'bg-gradient-to-br from-electric to-plasma text-white',
        variant === 'ghost' && 'bg-transparent border border-border/50 text-text-hi',
        className
      )}
      {...props}
    />
  );
}
