# database

Schema, migrations, and seed data — never ad-hoc scripts that mutate data outside a migration (Phase 1 §1). The Prisma schema itself lives at `apps/api/prisma/schema.prisma` per Prisma's convention; `migrations/` mirrors what Prisma generates, `seeds/` holds the idempotent seed entrypoint (`index.ts`, wired in this milestone with no seed data yet), and `schema/` is reserved for any entity/table reference material shared across modules.
