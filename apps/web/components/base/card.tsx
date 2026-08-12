import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Base card spec (Part 2 §11): 12px radius, `border.default`, `surface.card`
 * bg, `shadow.sm` at rest. Every Composite card (Course/Branch/Semester/
 * Subject) wraps this — never redefines the shell itself (Part 2 §23's
 * strict hierarchy: Composite may only be built from Base + Primitives).
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Part 2 §11: disabled ("Coming Soon") cards get 60% opacity, no hover/press response, inert cursor. */
  disabled?: boolean;
  /** Part 2 §11: hover lift + shadow step-up; skipped entirely when `disabled`. */
  interactive?: boolean;
}

export function Card({
  children,
  disabled = false,
  interactive = true,
  className = '',
  ...rest
}: CardProps) {
  const base =
    'rounded-card border border-border bg-surface-card p-4 md:p-5 shadow-sm transition-all duration-150 ease-out';
  const interactivity =
    disabled || !interactive
      ? 'opacity-60 cursor-not-allowed'
      : 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-border-strong active:translate-y-0 active:shadow-sm';

  return (
    <div className={`${base} ${interactivity} ${className}`} aria-disabled={disabled} {...rest}>
      {children}
    </div>
  );
}
