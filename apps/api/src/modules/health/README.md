# health

**Responsibility**: infrastructure-level liveness check (`GET /api/health`) used by load balancers and uptime monitors.

**Public interface**: `HealthController#check()` — returns `{ status: 'ok', timestamp }`. No service layer; this module has no business logic to encapsulate.
