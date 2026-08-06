# common

Cross-cutting code genuinely reused by 3+ modules only (Phase 1 §1/§9 Rule 4). Guards, interceptors, pipes, filters, and decorators live here. Anything narrower belongs inside its own module. Empty in Milestone 1 — populated as the first cross-cutting concern (e.g. `AuthGuard`, a global exception filter) is introduced by a future milestone.
