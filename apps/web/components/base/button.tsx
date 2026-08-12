import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

/**
 * Part 2 §9: 8px radius, `space.3`×`space.5` padding, `type.label`
 * typography, 150ms ease-out on background/border only (never size).
 * Only the three variants this milestone's read-only flow needs —
 * Danger/Success/Icon/Sticky/Purchase are added when the modules that use
 * them (Checkout, Admin) are built.
 */
export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  const base =
    'rounded-control px-5 py-3 font-body text-label font-semibold transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-faint';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-accent text-ink hover:bg-accent-hover active:bg-accent-pressed',
    secondary: 'border border-border-strong bg-transparent text-ink hover:bg-surface-sunken',
    ghost: 'bg-transparent text-ink hover:bg-surface-sunken',
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}
