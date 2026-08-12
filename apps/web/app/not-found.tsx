import { CompassIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '../components/base/button';

/** Part 3 (Error States table): "This page doesn't exist. Here's where you can go instead." + link back into Course selection. */
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-container flex-col items-center gap-4 px-4 py-9 text-center md:px-6">
      <CompassIcon className="h-8 w-8 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
      <h1 className="font-display text-display-md font-medium text-ink">
        This page doesn&apos;t exist.
      </h1>
      <p className="max-w-measure text-body-lg text-ink-soft">
        Here&apos;s where you can go instead.
      </p>
      <Link href="/">
        <Button variant="primary">Browse Courses</Button>
      </Link>
    </div>
  );
}
