import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = ({
  children,
  className,
  fullWidth = false,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-2xl font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        fullWidth && 'w-full',

        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-5 py-3 text-sm',
        size === 'lg' && 'px-6 py-4 text-base',

        variant === 'primary' && 'bg-black text-white hover:bg-neutral-800',
        variant === 'secondary' &&
          'border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400',
        variant === 'outline' &&
          'border border-black bg-transparent text-black hover:bg-black hover:text-white',
        variant === 'danger' &&
          'bg-red-600 text-white hover:bg-red-700',

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;