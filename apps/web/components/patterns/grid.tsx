import type { ReactNode } from 'react';

/** Part 2 §7: 4-up → 3-up → 2-up → 1-up (Course tiles only get 2-up; this grid is reused for Branch/Semester too, all tile-shaped choices). */
export function TileGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">{children}</div>
  );
}

/** Part 2 §7: Subject/Resource screens are list-leaning grids — wider cards, one column, more room per row. */
export function ListGrid({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 md:gap-4">{children}</div>;
}
