import type { SemesterResponseDto } from '@plan-b/shared-types';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';

import { Card } from '../base/card';

/**
 * Part 3 §5: large mono numeral as hero, subject count beneath — the
 * numeral *is* the icon. The Internship & Placement card alone gets a
 * distinguishing glyph, since it isn't a number and needs a different
 * at-a-glance read (Part 2 §11).
 */
export function SemesterCard({
  courseSlug,
  branchSlug,
  semester,
}: {
  courseSlug: string;
  branchSlug: string;
  semester: SemesterResponseDto;
}) {
  const numeral = semester.isPlacementTrack ? null : semester.label.replace(/[^0-9]/g, '');

  return (
    <Link href={`/${courseSlug}/${branchSlug}/${semester.id}`} className="block">
      <Card
        className="flex aspect-[4/3] flex-col items-center justify-center gap-2 text-center"
        aria-label={`${semester.label}, ${semester.subjectCount} subjects`}
      >
        {semester.isPlacementTrack ? (
          <Briefcase className="h-8 w-8 text-accent" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <span className="font-mono text-display-md font-medium text-ink">{numeral}</span>
        )}
        <span className="text-body-md text-ink-soft">{semester.label}</span>
        <span className="font-mono text-mono-code text-ink-faint">
          {semester.subjectCount} subjects
        </span>
      </Card>
    </Link>
  );
}
