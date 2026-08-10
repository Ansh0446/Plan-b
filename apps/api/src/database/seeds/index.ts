/**
 * Seed entrypoint. Per Phase 1 §9 Rule 25, all seed data must be idempotent
 * and re-runnable — never a one-time manual script.
 *
 * Milestone 2 introduces the full schema (all 27 entities from the
 * Database Bible), so `PrismaClient` is now safe to import statically —
 * `pnpm install` runs `prisma generate` automatically again (see
 * `postinstall` in apps/api/package.json), so a fresh clone always has a
 * generated client before this file is type-checked or run.
 *
 * No seed *data* is added in this milestone (Database Foundation is
 * schema/infrastructure only, per the Milestone 2 scope — actual lookup
 * rows for University/Course/Branch/Semester/ResourceType are a Content
 * Ops concern for a future milestone). Every seed step is required to be
 * an idempotent upsert (never a plain `create`), so re-running `pnpm
 * db:seed` after future milestones add real data is always safe.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Seed steps are added here, one idempotent `upsert` block per entity,
  // as each domain module is built. Example shape for a future milestone:
  //
  //   await prisma.university.upsert({
  //     where: { shortCode: 'GGSIPU' },
  //     update: {},
  //     create: { name: '...', shortCode: 'GGSIPU' },
  //   });
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
