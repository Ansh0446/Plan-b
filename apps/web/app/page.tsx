import { CourseCard } from '../components/composite/course-card';
import { ErrorState } from '../components/patterns/error-state';
import { TileGrid } from '../components/patterns/grid';
import { getCourses } from '../src/lib/academic-api';

// Never statically generated at build time -- see Milestone 3 note on dynamic rendering.
export const dynamic = 'force-dynamic';

/**
 * Part 3 §2: "the very first thing rendered must be the Course grid, with
 * no interstitial splash... instant, quiet, competent." A Server
 * Component fetch (not a client-side loading spinner) is what makes that
 * literal — the grid is in the initial HTML, not painted in after a spinner.
 *
 * Part 3 §3: "Empty state: not applicable here (courses are seeded
 * content, never zero)" — so this page has no empty-state branch, only
 * the error branch for a genuine fetch failure.
 */
export default async function CoursePage() {
  let courses;
  try {
    courses = await getCourses();
  } catch {
    return (
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 md:py-8">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-8 md:gap-8 md:px-6 md:py-8">
      <div>
        <h1 className="font-display text-display-lg font-light text-ink">Choose your course</h1>
        <p className="mt-2 max-w-measure text-body-lg text-ink-soft">
          B.Tech is live. Everything else is on the way.
        </p>
      </div>

      <TileGrid>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </TileGrid>
    </div>
  );
}
