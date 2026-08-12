import { Module } from '@nestjs/common';

import { BranchesModule } from '../branches/branches.module';

import { SemestersController } from './semesters.controller';
import { SemestersRepository } from './semesters.repository';
import { SemestersService } from './semesters.service';

@Module({
  imports: [BranchesModule],
  controllers: [SemestersController],
  providers: [SemestersService, SemestersRepository],
  exports: [SemestersService],
})
export class SemestersModule {}
