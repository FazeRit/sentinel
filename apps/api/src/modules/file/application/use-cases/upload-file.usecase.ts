import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { FILE_WRITE_PORT, FileWritePort } from '../ports/file-write.port';
import { MEMORY_STORAGE_READ_PORT } from '../ports/memory-storage-read.port';
import { FileEntity } from '../../domain/entities/file.entity';
import { MemoryStorageWritePort } from '../ports/memory-storage-write.port';

export class UploadFileUseCase {
  private readonly MAX_SIZE_MB: number = 15;

  //TODO: change to S3 upload
  constructor(
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWritePort,
    @Inject(MEMORY_STORAGE_READ_PORT)
    private readonly storage: MemoryStorageWritePort,
  ) {}

  async execute(labId: string, file: Express.Multer.File): Promise<FileEntity> {
    const domain = FileEntity.create({
      name: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      labId,
      storagePath: null,
    });

    if (!domain.isPdf()) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Only PDF is allowed.`,
      );
    }

    if (!domain.validateSize(this.MAX_SIZE_MB)) {
      throw new BadRequestException(
        `File is too large. Maximum size allowed is ${this.MAX_SIZE_MB}MB.`,
      );
    }

    let storagePath: string | null = null;

    try {
      storagePath = await this.storage.upload(domain, file);

      domain.setStoragePath(storagePath);

      await this.fileWriteRepo.save(domain);

      return domain;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to process file upload: ${error.message}`,
      );
    }
  }
}
