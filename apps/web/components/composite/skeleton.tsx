/**
 * Part 2 §19: "shape-matched to the real card layout (not generic gray
 * boxes)... `surface.sunken` base with a slow (1.5s loop) shimmer sweep."
 * One variant per tile-grid card shape used in this milestone; all share
 * the same `aspect-[4/3]` shell the real Course/Branch/Semester cards use,
 * so the layout never shifts when content arrives (Part 2 §14: skeleton →
 * content is a cross-fade only, never a "pop").
 */

function TileSkeleton() {
  return <div className="animate-shimmer aspect-[4/3] rounded-card border border-border" />;
}

function ListItemSkeleton() {
  return <div className="animate-shimmer h-[88px] rounded-card border border-border" />;
}

export function GridSkeleton({
  count = 8,
  variant = 'tile',
}: {
  count?: number;
  variant?: 'tile' | 'list';
}) {
  const Item = variant === 'tile' ? TileSkeleton : ListItemSkeleton;

  return (
    <div
      className={
        variant === 'tile'
          ? 'grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4'
          : 'flex flex-col gap-3 md:gap-4'
      }
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: count }).map((_, index) => (
        <Item key={index} />
      ))}
    </div>
  );
}
