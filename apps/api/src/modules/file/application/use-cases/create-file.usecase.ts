import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileEntity } from '../../domain/entities/file.entity';
import { LocalStorageWriteService } from '../../infra/services/local-storage-write.service';
import { FILE_WRITE_PORT, FileWritePort } from '../ports/file-write.port';
import { MEMORY_STORAGE_WRITE_PORT } from '../ports/memory-storage-write.port';

@Injectable()
export class CreateFileUseCase {
  private readonly MAX_SIZE_MB: number = 15;

  //TODO: change to S3 upload
  constructor(
    @Inject(FILE_WRITE_PORT)
    private readonly fileWriteRepo: FileWritePort,
    @Inject(MEMORY_STORAGE_WRITE_PORT)
    private readonly storageWrite: LocalStorageWriteService,
  ) {}

  async execute(labId: string, file: Express.Multer.File): Promise<FileEntity> {
    const fileEntity = FileEntity.create({
      ownerId: labId,
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

      await this.fileWriteRepo.save(fileEntity);

      return fileEntity;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to process file upload: ${error.message}`,
      );
    }
  }
}
