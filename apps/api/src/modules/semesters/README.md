# semesters

**Responsibility**: public, read-only access to the `Semester` entity (Phase 2 §2) — a global, branch-independent lookup, but this module's list endpoint scopes it per-Branch via the Branch–Semester–Subject Mapping so a sparsely-populated branch never shows semesters it has no content for.

**Endpoints**:

- `GET /api/v1/semesters?branchSlug=<slug>` — semesters with at least one live subject mapped for this branch, each with a branch-scoped subject count (Part 3 §5).
- `GET /api/v1/semesters/:id` — one semester (no per-branch subject count in this form).

No mutation endpoints — out of scope for Milestone 3.
