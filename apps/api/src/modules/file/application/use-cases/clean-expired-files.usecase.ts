import { Inject, Injectable } from '@nestjs/common';
import { FILE_READ_PORT, FileReadPort } from '../ports/file-read.port';
import { HardDeleteFilesUseCase } from './hard-delete-files.usecase';

@Injectable()
export class CleanExpiredFilesUseCase {
  private readonly RETENTION_DAYS = 5;

  constructor(
    @Inject(FILE_READ_PORT)
    private readonly fileReadRepo: FileReadPort,
    private readonly hardDeleteFilesUseCase: HardDeleteFilesUseCase,
  ) {}

  async execute(): Promise<void> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - this.RETENTION_DAYS);

    const expiredFiles =
      await this.fileReadRepo.findExpiredFiles(thresholdDate);

    if (!expiredFiles || expiredFiles.length === 0) {
      return;
    }

    const expiredIds = expiredFiles.map((file) => file.id);

    await this.hardDeleteFilesUseCase.execute(expiredIds);
  }
}
