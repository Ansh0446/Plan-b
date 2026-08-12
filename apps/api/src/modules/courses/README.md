# courses

**Responsibility**: public, read-only access to the `Course` entity (Phase 2 §2) — the first layer of the Academic Descent (Part 1).

**Endpoints**:

- `GET /api/v1/courses` — all non-archived courses, ordered for the Course grid (Part 3 §3).
- `GET /api/v1/courses/:slug` — one course.

No mutation endpoints exist — Course creation/editing is an Admin-panel concern, out of scope for Milestone 3.
