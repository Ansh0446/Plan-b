import type { BranchResponseDto } from '@plan-b/shared-types';
import Link from 'next/link';

import { Card } from '../base/card';

/**
 * Part 3 §4: name → 1-line description → subject count (mono). No status
 * badge here — unlike Course, Branch's active-vs-coming-soon is
 * communicated by list position + a divider label (see the branch page),
 * not a per-card badge, since Part 3 groups active branches together
 * first rather than interleaving badges through the grid.
 */
export function BranchCard({
  courseSlug,
  branch,
}: {
  courseSlug: string;
  branch: BranchResponseDto;
}) {
  const isActive = branch.status === 'ACTIVE';

  const content = (
    <Card
      disabled={!isActive}
      interactive={isActive}
      className="flex aspect-[4/3] flex-col justify-between"
      aria-label={`${branch.name}, ${branch.subjectCount} subjects mapped`}
    >
      <div>
        <p className="font-display text-heading-md font-medium text-ink">{branch.name}</p>
        {branch.description && (
          <p className="mt-1 text-body-md text-ink-soft">{branch.description}</p>
        )}
      </div>
      <p className="font-mono text-mono-code text-ink-faint">
        {branch.subjectCount} subjects mapped
      </p>
    </Card>
  );

  if (!isActive) {
    return <div title={`${branch.name} isn't live yet.`}>{content}</div>;
  }

  return (
    <Link href={`/${courseSlug}/${branch.slug}`} className="block">
      {content}
    </Link>
  );
}
