import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import { PrismaModule } from './database/prisma.module';
import { BranchesModule } from './modules/branches/branches.module';
import { CoursesModule } from './modules/courses/courses.module';
import { HealthModule } from './modules/health/health.module';
import { SemestersModule } from './modules/semesters/semesters.module';
import { SubjectResourcesModule } from './modules/subject-resources/subject-resources.module';
import { SubjectsModule } from './modules/subjects/subjects.module';

/**
 * Root module. Feature modules (orders, payments, auth, users, admin,
 * search, reviews, notifications, analytics-events — per Phase 1 §1) are
 * registered here as they're built in future milestones. Milestone 4 adds
 * `SubjectResourcesModule` (the Subject content layer) alongside
 * Milestone 3's Academic Descent modules.
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
    SubjectResourcesModule,
  ],
})
export class AppModule {}
