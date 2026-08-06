# modules

One self-contained feature per domain concept — never split a feature across two folders (Phase 1 §1). `health/` is the only module in Milestone 1 (infrastructure liveness check, not a domain feature). Domain modules — `courses/`, `branches/`, `semesters/`, `subjects/`, `resources/`, `resource-pipeline/`, `orders/`, `payments/`, `auth/`, `users/`, `admin/`, `search/`, `reviews/`, `notifications/`, `analytics-events/` — are added one at a time in future milestones, each following the Controller → Service → Repository layering in Phase 1 §3.
