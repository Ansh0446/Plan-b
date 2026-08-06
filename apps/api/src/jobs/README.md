# jobs

Anything that must survive outside a single HTTP request/response lifecycle (Phase 1 §1/§3 Rule 6) — watermarking, thumbnailing, page rasterizing, search re-indexing, transactional email sends. A Service method enqueues a job; it never blocks a request waiting on one. Empty in Milestone 1 — populated alongside the resource pipeline and notifications modules in a future milestone.
