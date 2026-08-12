import { notFound } from 'next/navigation';

import { BranchCard } from '../../components/composite/branch-card';
import { TranscriptTrail } from '../../components/composite/transcript-trail';
import { EmptyState } from '../../components/patterns/empty-state';
import { ErrorState } from '../../components/patterns/error-state';
import { TileGrid } from '../../components/patterns/grid';
import { getBranches, getCourse } from '../../src/lib/academic-api';
import { ApiError } from '../../src/lib/api';

// Never statically generated at build time -- see Milestone 3 note on dynamic rendering.
export const dynamic = 'force-dynamic';

/**
 * Part 3 §4: active branches first, then a divider, then Coming Soon
 * branches — never interleaved by name/date. Part 1 §8's URL hierarchy:
 * `/[courseSlug]`.
 */
export default async function BranchPage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await params;

  let course;
  try {
    course = await getCourse(courseSlug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return (
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 md:py-8">
        <ErrorState />
      </div>
    );
  }

  let branches;
  try {
    branches = await getBranches(courseSlug);
  } catch {
    return (
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 md:py-8">
        <ErrorState />
      </div>
    );
  }

  const active = branches.filter((branch) => branch.status === 'ACTIVE');
  const comingSoon = branches.filter((branch) => branch.status !== 'ACTIVE');

  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-8 md:gap-8 md:px-6 md:py-8">
      <TranscriptTrail segments={[{ label: 'Courses', href: '/' }, { label: course.name }]} />

      <div>
        <h1 className="font-display text-display-lg font-light text-ink">
          Choose your specialization
        </h1>
        <p className="mt-2 max-w-measure text-body-lg text-ink-soft">{course.name}</p>
      </div>

      {branches.length === 0 ? (
        <EmptyState
          title="No specializations mapped yet."
          description="This course's branch structure is being set up. Check back soon."
        />
      ) : (
        <>
          <TileGrid>
            {active.map((branch) => (
              <BranchCard key={branch.id} courseSlug={courseSlug} branch={branch} />
            ))}
          </TileGrid>

          {comingSoon.length > 0 && (
            <>
              <p className="text-label font-semibold uppercase tracking-wide text-ink-faint">
                Coming soon
              </p>
              <TileGrid>
                {comingSoon.map((branch) => (
                  <BranchCard key={branch.id} courseSlug={courseSlug} branch={branch} />
                ))}
              </TileGrid>
            </>
          )}
        </>
      )}
    </div>
  );
}
