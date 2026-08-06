# Plan B — Monorepo

Production foundation for Plan B: a Next.js frontend, a NestJS API, and a
shared-types package, orchestrated with Turborepo and pnpm workspaces.

This repository is scaffolding only — **no business logic, authentication,
database models, API routes, or UI pages are implemented yet.** It exists so
that every subsequent milestone lands on a repository that already compiles,
lints, formats, and runs in dev/build/start modes end-to-end.

> Architecture, naming, and folder-responsibility rules are locked in
> `docs/` (Parts 1–5, Phases 1–3). Nothing here should contradict them; any
> approved deviation must be recorded as an ADR in `docs/adr/`.

---

## Stack

| Layer           | Technology                                       |
| --------------- | ------------------------------------------------ |
| Frontend        | Next.js (App Router) + TypeScript + Tailwind CSS |
| Backend         | NestJS + TypeScript                              |
| Database        | PostgreSQL                                       |
| ORM             | Prisma                                           |
| Monorepo        | Turborepo                                        |
| Package manager | pnpm                                             |

## Repository layout

```
plan-b/
├── apps/
│   ├── web/                # Next.js app (frontend)
│   └── api/                 # NestJS app (backend)
├── packages/
│   ├── ui/                  # Shared, framework-agnostic UI primitives
│   ├── shared-types/         # Cross-boundary TypeScript contracts (front ↔ back)
│   └── config/               # Shared tsconfig / eslint / tailwind base configs
├── docs/                    # Locked planning documents + ADRs
├── infra/                   # Deployment configs & env templates (no real secrets)
├── .github/workflows/       # CI pipelines
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## Prerequisites

- Node.js `>=20.11.0`
- pnpm `>=9.0.0` (enable via `corepack enable`)
- PostgreSQL `>=15` running locally or reachable via `DATABASE_URL`

## Getting started

```bash
# 1. Install dependencies
corepack enable
pnpm install

# 2. Copy environment templates
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# 3. Generate the Prisma client (no models defined yet — this is a no-op
#    until Phase 2's schema lands, but keeps the pipeline wired end to end)
pnpm db:generate

# 4. Run everything in dev mode
pnpm dev
```

- Web dev server: http://localhost:3000
- API dev server: http://localhost:4000

## Common commands

| Command                             | Description                                     |
| ----------------------------------- | ----------------------------------------------- |
| `pnpm dev`                          | Run all apps in watch mode (Turborepo pipeline) |
| `pnpm dev:web` / `pnpm dev:api`     | Run a single app in watch mode                  |
| `pnpm build`                        | Build all apps and packages                     |
| `pnpm start`                        | Run production builds (after `pnpm build`)      |
| `pnpm lint`                         | Lint every workspace                            |
| `pnpm lint:fix`                     | Lint and auto-fix every workspace               |
| `pnpm typecheck`                    | Type-check every workspace with no emit         |
| `pnpm test`                         | Run unit tests in every workspace               |
| `pnpm test:e2e`                     | Run end-to-end tests (api)                      |
| `pnpm format` / `pnpm format:check` | Prettier write/check across the repo            |
| `pnpm db:generate`                  | Generate the Prisma client                      |
| `pnpm db:migrate`                   | Run Prisma migrations (dev)                     |
| `pnpm db:migrate:deploy`            | Apply migrations (CI/production)                |
| `pnpm db:seed`                      | Run database seed scripts                       |
| `pnpm db:studio`                    | Open Prisma Studio                              |
| `pnpm clean`                        | Remove build artifacts and `node_modules`       |

All commands are Turborepo pipelines (see `turbo.json`) and can be scoped
with `--filter=<workspace>`, e.g. `pnpm turbo run lint --filter=web`.

## Environments

Four distinct environments are supported end-to-end: `development`, `test`,
`staging`, `production`. Config is always read from typed, validated loaders
(`apps/api/src/config/*` on the backend, a single `apps/web/src/env.ts` on
the frontend) — never `process.env` scattered through business logic. See
`infra/README.md` and the `.env.example` files for the full variable list.

## Git & commit conventions

- Branches: `type/short-description` (`feature/`, `fix/`, `chore/`,
  `refactor/`, `docs/`, `hotfix/`).
- Commits: [Conventional Commits](https://www.conventionalcommits.org/),
  enforced by commitlint on every commit (`type(scope): description`).
- Pre-commit: lint-staged runs ESLint + Prettier on staged files via Husky.
- No PR merges without passing CI and one review.

## Workspace packages

- **`@plan-b/ui`** — shared, presentational UI primitives with zero domain
  knowledge, consumable by `apps/web` (and any future client).
- **`@plan-b/shared-types`** — the single legal definition of every
  cross-boundary data shape shared between `apps/web` and `apps/api`.
- **`@plan-b/config`** — shared base `tsconfig`, ESLint, and Tailwind
  configuration consumed by every app/package so conventions stay in one
  place.

## Documentation

The full product/engineering reference set lives in `docs/`:

- `docs/part-1.md` … `docs/part-5.md` — Information Architecture, Design
  System, UX Blueprint, Engineering Bible, and supporting material.
- `docs/phase-1-foundation.md` — this repository's structural contract.
- `docs/phase-2-database-bible.md` — the locked Prisma/PostgreSQL schema
  reference.
- `docs/phase-3-technical-specification.md` — the locked technical spec.
- `docs/adr/` — Architecture Decision Records for any approved deviation.
