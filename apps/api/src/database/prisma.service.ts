import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * The single Prisma Client instance for the whole application. Every
 * `*.repository.ts` (Phase 1 §3 — "Services never touch the database
 * directly — always through a repository") injects this service rather
 * than instantiating its own `PrismaClient`.
 *
 * Logging is env-aware: verbose query logs in development, warnings/errors
 * only elsewhere — never logging query parameters in production, since
 * those can contain personally identifying data (Section 13's DPDP note).
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? [
              { emit: 'event', level: 'query' },
              { emit: 'stdout', level: 'warn' },
              { emit: 'stdout', level: 'error' },
            ]
          : [
              { emit: 'stdout', level: 'warn' },
              { emit: 'stdout', level: 'error' },
            ],
    });
  }

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      // Prisma's event-based query log is only wired up in development —
      // see the `log` config above. Cast is required because the emitted
      // event shape isn't part of PrismaClient's public generic types.
      (this as unknown as { $on: (event: 'query', cb: (e: unknown) => void) => void }).$on(
        'query',
        (event) => {
          this.logger.debug(JSON.stringify(event));
        },
      );
    }

    await this.$connect();
    this.logger.log('Prisma Client connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Prisma Client disconnected');
  }
}
