# subjects

**Responsibility**: public, read-only access to the `Subject` entity (Phase 2 §2) — the pain/relevance anchor of the Academic Descent (Part 3 §6).

**Endpoints**:

- `GET /api/v1/subjects?branchSlug=<slug>&semesterId=<id>` — subjects mapped to one branch+semester pair, via the Branch–Semester–Subject Mapping.
- `GET /api/v1/subjects/:code` — one subject's full detail (name, code, description, aliases, resource count) — backs the frontend's Subject preview panel. Lookup is case-insensitive since the public URL segment is lowercase.

No mutation endpoints — out of scope for Milestone 3. No Resource List endpoint either — the Resource entity/module doesn't exist yet (a future milestone); the Subject detail response is the terminal screen for this milestone's scope.
