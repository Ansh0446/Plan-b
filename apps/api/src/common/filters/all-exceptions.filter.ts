import type {
  ArgumentsHost,
  ExceptionFilter} from '@nestjs/common';
import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { resolveRequestId } from '../utils/request-id.util';

/**
 * Phase 3 §3/§10: "one consistent error envelope (`code`, `message`,
 * `details?`) across every endpoint, every error type... a frontend
 * developer never needs special-case parsing logic per error class, only
 * different *display* logic keyed off the `code` field."
 *
 * Validation errors get their field-level `details` array (§3: "never a
 * single opaque message string when multiple fields fail at once").
 * Server errors return a generic message and never leak internal detail
 * (§10) — the real error is still logged server-side.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = resolveRequestId(request);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const { code, message, details } = normalizeHttpExceptionBody(body, status);

      response.status(status).json({
        error: { code, message, details },
        meta: { requestId },
      });
      return;
    }

    // Anything that isn't a recognized HttpException is a server error —
    // per §10, log full detail internally, return only a generic message.
    this.logger.error(exception instanceof Error ? exception.stack : exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        code: 'server_error',
        message: 'Something went wrong on our end. Please try again in a moment.',
      },
      meta: { requestId },
    });
  }
}

interface NormalizedError {
  code: string;
  message: string;
  details?: unknown;
}

function normalizeHttpExceptionBody(body: unknown, status: HttpStatus): NormalizedError {
  if (status === HttpStatus.NOT_FOUND) {
    return {
      code: 'not_found',
      message: extractMessage(body, 'The requested resource was not found.'),
    };
  }
  if (status === HttpStatus.BAD_REQUEST) {
    const message = extractMessage(body, 'The request could not be processed.');
    const rawMessage =
      typeof body === 'object' && body !== null
        ? (body as { message?: unknown }).message
        : undefined;
    // class-validator's ValidationPipe produces `message: string[]` — one
    // entry per failed field — which becomes the `details` array §3 requires.
    const details = Array.isArray(rawMessage) ? rawMessage : undefined;
    return { code: 'validation_error', message, details };
  }
  if (status === HttpStatus.UNAUTHORIZED) {
    return {
      code: 'unauthenticated',
      message: extractMessage(body, 'Authentication is required.'),
    };
  }
  if (status === HttpStatus.FORBIDDEN) {
    return { code: 'forbidden', message: extractMessage(body, "You don't have access to this.") };
  }
  return { code: 'error', message: extractMessage(body, 'The request could not be processed.') };
}

function extractMessage(body: unknown, fallback: string): string {
  if (typeof body === 'string') return body;
  if (typeof body === 'object' && body !== null && 'message' in body) {
    const { message } = body as { message: unknown };
    if (typeof message === 'string') return message;
    if (Array.isArray(message) && message.length > 0) return String(message[0]);
  }
  return fallback;
}
