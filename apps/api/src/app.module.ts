import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import { PrismaModule } from './database/prisma.module';
import { BranchesModule } from './modules/branches/branches.module';
import { CoursesModule } from './modules/courses/courses.module';
import { HealthModule } from './modules/health/health.module';
import { SemestersModule } from './modules/semesters/semesters.module';
import { SubjectsModule } from './modules/subjects/subjects.module';

/**
 * Root module. Feature modules (resources, orders, payments, auth, users,
 * admin, search, reviews, notifications, analytics-events — per Phase 1
 * §1) are registered here as they're built in future milestones.
 * Milestone 3 adds the Academic Descent's public read modules
 * (`CoursesModule`, `BranchesModule`, `SemestersModule`, `SubjectsModule`)
 * alongside Milestone 1/2's infrastructure-level wiring.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
      cache: true,
    }),
    PrismaModule,
    HealthModule,
    CoursesModule,
    BranchesModule,
    SemestersModule,
    SubjectsModule,
  ],
})
export class AppModule {}
