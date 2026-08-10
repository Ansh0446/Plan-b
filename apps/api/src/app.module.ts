import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import appConfig from './config/app.config';
import { HealthModule } from './modules/health/health.module';

/**
 * Root module. Feature modules (courses, resources, orders, payments,
 * auth, users, admin, search, reviews, notifications, analytics-events —
 * per Phase 1 §1) are registered here as they're built in future
 * milestones. Only infrastructure-level wiring (global config, health
 * check) belongs in this milestone.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
      cache: true,
    }),
    HealthModule,
    PrismaModule,
  ],
})
export class AppModule {}
