'use client';

import { AlertCircle } from 'lucide-react';

import { Button } from '../base/button';

/**
 * Part 2 §18: "Something didn't load. Refresh, or try again in a
 * moment." — never blames the user, never over-apologizes. `onRetry` is
 * optional since a Server Component page can't pass a client callback
 * across the boundary; those pages fall back to the browser refresh
 * affordance implied by the copy itself.
 */
export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface-card px-6 py-9 text-center">
      <AlertCircle className="h-6 w-6 text-status-error" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-body-lg text-ink">Something didn&apos;t load.</p>
      <p className="max-w-measure text-body-md text-ink-soft">Refresh, or try again in a moment.</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
