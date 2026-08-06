# infra

Config _shapes_, never real secret values (Phase 1 §1/§7). This folder
documents the four supported environments and points to each app's own
`.env.example`, which is the actual source of truth for variable names.

## Environments

| Environment   | Purpose                     | Payment keys                                         | Storage                                       |
| ------------- | --------------------------- | ---------------------------------------------------- | --------------------------------------------- |
| `development` | Local machine               | Razorpay test keys                                   | Local/dev R2 bucket                           |
| `test`        | CI runs                     | Razorpay test keys                                   | Mocked/dev bucket, never touches real storage |
| `staging`     | Pre-production verification | Razorpay test keys                                   | Staging R2 bucket                             |
| `production`  | Live traffic                | Razorpay **live** keys, injected only at deploy time | Production R2 bucket                          |

## Where variables are defined

- Frontend: `apps/web/.env.example`
- Backend: `apps/api/.env.example`

Actual secrets are never committed, in any branch, at any point in history
(Phase 1 §9 Rule 32). They live in the hosting platform's secret manager
(e.g. Vercel/Railway/Render environment dashboards) and are injected at
deploy time, scoped to the narrowest environment they need.
