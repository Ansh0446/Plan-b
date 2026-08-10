# database/repositories

Generic repository _contracts_ only (Milestone 2: Database Foundation).
Concrete repositories (`resources.repository.ts`, `orders.repository.ts`,
...) belong inside their own feature module under `src/modules/<name>/`
per Phase 1 §3 — never here — and are built module-by-module in future
milestones.

- `base.repository.interface.ts` — `BaseRepository`, `SoftDeletableRepository`,
  `HardDeletableRepository`, and `AppendOnlyRepository`. Every future
  `*.repository.ts` implements exactly one of these, chosen by which
  Section 9 delete strategy its entity uses (see
  `database/utils/soft-delete.util.ts` for the three soft-delete shapes and
  which entities use each).

Why interfaces live here instead of inside each future module: Phase 1 §3's
Controller→Service→Repository layering is enforced per module, but the
_shape_ of "what a repository looks like" is a database-foundation concern
that every module's repository must conform to identically — defining it
once here is what keeps that shape from drifting module to module.
