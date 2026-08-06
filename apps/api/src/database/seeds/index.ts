/**
 * Seed entrypoint. Per Phase 1 §9 Rule 25, all seed data must be idempotent
 * and re-runnable — never a one-time manual script. No Course/Branch seed
 * data exists yet (Milestone 1 is repository setup only); this file wires
 * `pnpm db:seed` end-to-end so future milestones only need to add seed
 * logic here, not new plumbing.
 *
 * `PrismaClient` is intentionally NOT imported yet: the schema has no
 * models until Milestone 2, so nothing runs `prisma generate`
 * automatically during install/dev (see apps/api/package.json). Importing
 * it statically here would fail type-checking on a fresh clone before
 * generation has ever happened. Once Milestone 2 adds models and runs
 * `pnpm db:generate`, replace the body below with:
 *
 *   import { PrismaClient } from '@prisma/client';
 *   const prisma = new PrismaClient();
 *   // ...idempotent upserts...
 *   await prisma.$disconnect();
 */

async function main(): Promise<void> {
  // Seed steps are added here, one idempotent upsert block per entity,
  // as each domain module is built.
}

main().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
