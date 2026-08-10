import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

/**
 * `@Global()` because the database connection is a true cross-cutting
 * dependency (Phase 1 §1's `common/` rule doesn't apply here — this isn't
 * "reused by 3+ modules," it's foundational infrastructure every module
 * needs). Every future feature module's repositories inject `PrismaService`
 * without needing to re-import this module themselves once it's registered
 * once in `AppModule`.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
