import { Module } from '@nestjs/common';

import { HealthController } from './health.controller';

/**
 * Infrastructure-level liveness check (used by load balancers / uptime
 * monitors), not a domain feature module. Proves the app boots, the module
 * graph resolves, and the HTTP layer responds — nothing more.
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
