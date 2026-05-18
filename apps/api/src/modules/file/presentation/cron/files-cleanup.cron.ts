import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CleanExpiredFilesUseCase } from '../../application/use-cases/clean-expired-files.usecase';

@Injectable()
export class FileCleanUpCron {
  constructor(
    private readonly cleanExpiredFilesUseCase: CleanExpiredFilesUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async execute(): Promise<void> {
    await this.cleanExpiredFilesUseCase.execute();
  }
}
