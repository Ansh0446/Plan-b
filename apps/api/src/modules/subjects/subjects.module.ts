import { Module } from '@nestjs/common';

import { BranchesModule } from '../branches/branches.module';

import { SubjectsController } from './subjects.controller';
import { SubjectsRepository } from './subjects.repository';
import { SubjectsService } from './subjects.service';

@Module({
  imports: [BranchesModule],
  controllers: [SubjectsController],
  providers: [SubjectsService, SubjectsRepository],
  exports: [SubjectsService],
})
export class SubjectsModule {}
