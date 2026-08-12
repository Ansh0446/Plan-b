import type { Metadata } from 'next';

import { Navbar } from '../components/patterns/navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plan B',
  description: 'Find the exact resource for your exact subject.',
};

/**
 * Milestone 3 ships dark theme as the product's default and only active
 * theme (`className="dark"`, static). The token architecture (styles/
 * tokens/tokens.css) is already fully light+dark capable per Part 2 §4 —
 * a profile-menu theme toggle with persistence (Part 2 §12) is deferred to
 * the milestone that introduces Auth/Settings, since it has nowhere to
 * live without a profile menu.
 *
 * Fonts (Part 2 §5: Fraunces/Inter/JetBrains Mono) are declared as CSS
 * family names in tailwind.config.ts rather than loaded via
 * `next/font/google` — see that file's comment for why.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
