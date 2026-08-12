import type { Request } from 'express';

/**
 * Phase 3 §11: "a request ID that flows frontend→backend," used to
 * correlate a response with its logs. No request-id middleware exists yet
 * (Milestone 3 is read-only public APIs, not the full auth/observability
 * stack), so this reads an inbound `X-Request-Id` header if the caller
 * sent one, otherwise mints a short one — shared by
 * `AllExceptionsFilter` and `ResponseInterceptor` so both envelopes always
 * agree on the same id for a given request.
 */
export function resolveRequestId(request: Request): string {
  const inbound = request.headers['x-request-id'];
  if (typeof inbound === 'string' && inbound.length > 0) return inbound;
  return `req_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
