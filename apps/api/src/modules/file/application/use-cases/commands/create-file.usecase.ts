import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Inject,
  Logger,
} from '@nestjs/common';
import { FileEntity } from '../../../domain/entities/file.entity';
import { FILE_WRITE_PORT, FileWritePort } from '../../ports/database/file-write.port';
import {
  MEMORY_STORAGE_WRITE_PORT,
  MemoryStorageWritePort,
} from '../../ports/storage/memory-storage-write.port';
import { FILE_QUEUE_PORT, FileQueuePort } from '../../ports/queue/file-queue.port';

@Injectable()
export class CreateFileUseCase {
  private readonly MAX_SIZE_MB: number = 15;
  private readonly logger = new Logger(CreateFileUseCase.name);

  //TODO: change to S3 upload
  constructor(
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWritePort,
    @Inject(MEMORY_STORAGE_WRITE_PORT)
    private readonly storageWrite: MemoryStorageWritePort,
    @Inject(FILE_QUEUE_PORT)
    private readonly fileQueue: FileQueuePort,
  ) {}

  async execute(
    labId: string,
    ownerId: string,
    file: Express.Multer.File,
  ): Promise<FileEntity> {
    const fileEntity = FileEntity.create({
      ownerId,
      name: file.originalname,
      bytes: file.size,
      mimetype: file.mimetype,
      labId,
      storagePath: null,
    });

    if (!fileEntity.isPdf()) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Only PDF is allowed.`,
      );
    }

    if (!fileEntity.validateSize(this.MAX_SIZE_MB)) {
      throw new BadRequestException(
        `File is too large. Maximum size allowed is ${this.MAX_SIZE_MB}MB.`,
      );
    }

    let storagePath: string | null = null;

    try {
      const fileId = fileEntity.id;

      storagePath = await this.storageWrite.upload(fileId, file);

      fileEntity.setStoragePath(storagePath);

      await this.fileWriteRepo.saveFile(fileEntity);

      await this.fileQueue.enqueueProcessing(fileEntity.id);

      return fileEntity;
    } catch (error) {
      this.logger.error(
        `Failed to process file upload: ${error.stack || error.message || error}`,
      );
      throw new InternalServerErrorException(
        'Failed to process file upload due to an internal error.',
      );
    }
  }
}
