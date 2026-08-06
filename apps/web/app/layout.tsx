import type { Metadata } from 'next';

import './globals.css';

/**
 * Root shell only: <html>, global providers slot, global stylesheet.
 * Navbar/Footer and any real chrome are Pattern-layer components injected
 * here in a future milestone (Phase 1 §4/§5) — this file stays intentionally
 * minimal so the app compiles and runs before any UI work begins.
 */
export const metadata: Metadata = {
  title: 'Plan B',
  description: 'Plan B',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
