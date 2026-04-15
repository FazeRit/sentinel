import {
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.usecase';
import { ApiResponseDto } from 'src/shared/dto/response/api-response.dto';
import { FileResponseDto } from '../dto/response/file-response.dto';
import { UploadFileDto } from '../dto/request/upload-file.dto';

export class FileWriteController {
  constructor(private readonly uploadFileUseCase: UploadFileUseCase) {}

  // TODO: think about getting with decorators message and status for api response dto, and using auto interceptor to skip this creepy creating response class every time
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    dto: UploadFileDto,
  ): Promise<ApiResponseDto<FileResponseDto>> {
    const { labId } = dto;

    const fileEntity = await this.uploadFileUseCase.execute(labId, file);

    const data = FileResponseDto.fromEntity(fileEntity);

    const response = new ApiResponseDto({
      data,
      status: HttpStatus.CREATED,
      message: 'File uploaded successfully',
      timestamp: new Date(),
      path: '/files/upload',
    });

    return response;
  }
}
