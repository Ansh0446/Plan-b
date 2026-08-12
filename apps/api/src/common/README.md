# common

Cross-cutting code genuinely reused by 3+ modules only (Phase 1 §1/§9
Rule 4). Anything narrower belongs inside its own module.

- **`filters/all-exceptions.filter.ts`** — the single error envelope
  (`error: { code, message, details? }`) required by Phase 3 §3/§10.
  Applied per-controller (`@UseFilters`) on each Milestone 3 module,
  rather than globally in `main.ts`, so Milestone 1's Health module keeps
  its original, unwrapped response shape.
- **`interceptors/response.interceptor.ts`** — the single success envelope
  (`data`/`meta` or `data`/`pagination`/`meta`) required by Phase 3 §3.
  Same per-controller application as the filter above.
- **`utils/request-id.util.ts`** — shared by both, so a given request's
  error and success paths always agree on the same request id.
- `guards/`, `pipes/`, `decorators/` — still empty as of Milestone 3;
  populated once Authentication (Phase 3 §2 stage 5) introduces the first
  guard-worthy concern.
