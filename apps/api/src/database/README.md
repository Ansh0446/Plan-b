# database

Schema, migrations, seed data, and database-layer infrastructure — never
ad-hoc scripts that mutate data outside a migration (Phase 1 §1).

- **`prisma.service.ts`** / **`prisma.module.ts`** — the single, global
  `PrismaClient` instance (Milestone 2 requirement #11). Every future
  `*.repository.ts` injects `PrismaService`; nothing outside this folder
  instantiates `PrismaClient` directly.
- **`repositories/`** — generic repository _interfaces_ only
  (`BaseRepository`, `SoftDeletableRepository`, `HardDeletableRepository`,
  `AppendOnlyRepository`). Concrete repositories live inside their own
  feature module (`src/modules/<name>/`) in future milestones, per
  Phase 1 §3.
- **`utils/`** — shared, stateless database utilities: pagination
  (`pagination.util.ts`), money/Decimal conversion (`decimal.util.ts`),
  and the per-entity soft-delete `where` fragments implementing Section 9
  (`soft-delete.util.ts`).
- **`seeds/`** — the idempotent seed entrypoint (`index.ts`). Per Phase 1
  §9 Rule 25, all seed data must be idempotent and re-runnable — never a
  one-time manual script.
- **`schema/`** — reserved for any entity/table reference material shared
  across modules; empty as of Milestone 2.

Migrations do **not** live under this folder — Prisma's own convention
puts them at `apps/api/prisma/migrations/`, alongside `schema.prisma`
itself, and this repository follows that convention rather than
duplicating it under `src/`.
