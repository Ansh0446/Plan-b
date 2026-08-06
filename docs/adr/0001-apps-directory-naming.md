# ADR 0001: Use `apps/web` and `apps/api` instead of root-level `frontend/` and `backend/`

- **Status**: Accepted
- **Date**: 2026-08-06
- **Related**: Phase 1 — Project Foundation, §1 (Complete Folder Structure)

## Context

Phase 1 §1 shows the Next.js and NestJS apps living at the repository root as
`frontend/` and `backend/`, with Turborepo integration described as
optional. Milestone 1 (Repository & Monorepo Setup) explicitly requires a
Turborepo + pnpm workspace with apps initialized at `apps/web` and
`apps/api`, which is the standard Turborepo convention and is what the
milestone's approved stack and deliverable list specify.

## Decision

The applications are placed at `apps/web` (Next.js) and `apps/api` (NestJS)
instead of root-level `frontend/` and `backend/`. Every internal folder
Phase 1 specifies inside each app (`src/modules`, `src/common`, `app/`,
`components/primitives|base|composite|patterns`, etc.) is preserved
unchanged inside the renamed root — only the top-level directory name
changes, to fit the monorepo's `apps/*` convention. Phase 1 §12 already
anticipates this shape implicitly (`apps/mobile` as a future addition),
confirming `apps/*` as the intended long-term convention.

## Consequences

- All future milestones should reference `apps/web/...` and `apps/api/...`
  in place of Phase 1's `frontend/...` and `backend/...` path prefixes.
- No architectural rule, layering rule, or naming convention from Phase 1
  §2–§11 changes — only the two top-level directory names.
