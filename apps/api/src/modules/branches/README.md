# branches

**Responsibility**: public, read-only access to the `Branch` entity (Phase 2 §2). Publicly referred to as "Specialization" in product copy — the entity itself stays `Branch`, unchanged from the locked schema.

**Endpoints**:

- `GET /api/v1/branches?courseSlug=<slug>` — branches for one course, active-first (Part 3 §4).
- `GET /api/v1/branches/:slug` — one branch.

No mutation endpoints — out of scope for Milestone 3.
