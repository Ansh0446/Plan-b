import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { map, type Observable } from 'rxjs';

import { resolveRequestId } from '../utils/request-id.util';

/**
 * Phase 3 §3: "a single envelope shape for single-item responses (`data`,
 * `meta`) and a distinct but related envelope for list responses (`data`,
 * `pagination`, `meta`)." Controllers return plain service results; this
 * interceptor is the one place that shapes every response identically, so
 * no controller in the app hand-rolls its own envelope.
 *
 * §3 also requires cursor-based pagination "on every endpoint expected to
 * reach a large result set (Resources, Orders)." None of Milestone 3's
 * endpoints are in that category — Courses/Branches/Semesters/Subjects are
 * all small, fully-seeded lookup lists (Phase 2 §2) — so `pagination` is
 * always `{ nextCursor: null }` here: the envelope shape stays consistent
 * with every other list endpoint without pretending these are paginated
 * when the full result always fits in one response.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = resolveRequestId(request);

    return next.handle().pipe(
      map((result: unknown) => {
        const meta = { requestId };

        if (Array.isArray(result)) {
          return { data: result, pagination: { nextCursor: null }, meta };
        }

        return { data: result, meta };
      }),
    );
  }
}
