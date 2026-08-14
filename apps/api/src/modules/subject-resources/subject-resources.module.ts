import { Module } from '@nestjs/common';

import { SubjectsModule } from '../subjects/subjects.module';

import { SubjectResourcesController } from './subject-resources.controller';
import { SubjectResourcesRepository } from './subject-resources.repository';
import { SubjectResourcesService } from './subject-resources.service';

@Module({
  imports: [SubjectsModule],
  controllers: [SubjectResourcesController],
  providers: [SubjectResourcesService, SubjectResourcesRepository],
  exports: [SubjectResourcesService],
})
export class SubjectResourcesModule {}
