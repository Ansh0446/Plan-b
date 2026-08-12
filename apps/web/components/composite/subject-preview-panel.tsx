'use client';

import type { SubjectDetailDto } from '@plan-b/shared-types';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getSubject } from '../../src/lib/academic-api';
import { ApiError } from '../../src/lib/api';
import { CodeChip } from '../base/badge';
import { Button } from '../base/button';

/**
 * Backs the Milestone 3 "Subject preview panel." Part 3 §6 evaluated each
 * candidate metadata field against the brand and landed on exactly:
 * Subject Code (yes), Resource Count (yes) — both already on the list
 * card — plus, in this richer detail fetch, Description and Aliases.
 * Credits/Faculty/Estimated Study Time/Difficulty are deliberately never
 * shown (Part 3 §6's table), and don't exist on `SubjectDetailDto` at all.
 *
 * A side panel, not a route change — Part 3 frames the Subject Page as
 * this milestone's terminal screen (no Resource List exists yet), so a
 * slide-in panel keeps the student in the grid they were scanning rather
 * than a hard navigation for content this shallow.
 */
export function SubjectPreviewPanel({ code, onClose }: { code: string; onClose: () => void }) {
  const [subject, setSubject] = useState<SubjectDetailDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getSubject(code)
      .then((result) => {
        if (!cancelled) setSubject(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : 'Something went wrong loading this subject.',
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="bg-ink/40 fixed inset-0 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-measure flex-col gap-5 overflow-y-auto border-l border-border bg-surface-elevated p-5 shadow-md md:p-6"
        role="dialog"
        aria-label="Subject preview"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-caption uppercase tracking-wide text-ink-faint">Subject preview</p>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="rounded-full p-1 text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {loading && (
          <div className="flex flex-col gap-3" role="status" aria-label="Loading subject">
            <div className="animate-shimmer h-8 w-3/4 rounded" />
            <div className="animate-shimmer h-5 w-1/3 rounded" />
            <div className="animate-shimmer h-24 w-full rounded" />
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col gap-3">
            <p className="text-body-lg text-ink">
              Something didn&apos;t load. Refresh, or try again in a moment.
            </p>
            <p className="text-body-md text-ink-soft">{error}</p>
          </div>
        )}

        {!loading && !error && subject && (
          <>
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-display-md font-medium text-ink">{subject.name}</h2>
              <div className="flex items-center gap-2">
                <CodeChip>{subject.code}</CodeChip>
                {subject.aliases.length > 0 && (
                  <span className="text-caption text-ink-faint">
                    also known as {subject.aliases.join(', ')}
                  </span>
                )}
              </div>
            </div>

            {subject.description && (
              <p className="text-body-lg text-ink-soft">{subject.description}</p>
            )}

            <div className="rounded-card border border-border bg-surface-sunken p-4">
              <p className="font-mono text-mono-price text-ink">{subject.resourceCount}</p>
              <p className="text-body-md text-ink-soft">
                resource{subject.resourceCount === 1 ? '' : 's'} available
              </p>
            </div>

            {subject.resourceCount === 0 && (
              <p className="text-body-md text-ink-faint">
                Nothing here yet — resources for this subject are on the way.
              </p>
            )}

            <Button variant="secondary" onClick={onClose} className="mt-auto w-full">
              Back to subjects
            </Button>
          </>
        )}
      </aside>
    </>
  );
}
