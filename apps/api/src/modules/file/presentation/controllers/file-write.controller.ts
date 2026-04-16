import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.usecase';
import { ApiResponseDto } from 'src/shared/dto/response/api-response.dto';
import { FileResponseDto } from '../dto/response/file-response.dto';
import { UploadFileDto } from '../dto/request/upload-file.dto';
import { DeleteFileDto } from '../dto/request/delete-file.dto';
import { DeleteFileUseCase } from '../../application/use-cases/delete-file.usecase';
import { DeleteFileByLabIdUseCase } from '../../application/use-cases/delete-files-by-lab-id.usecase';
import { DeleteFilesByLabIdDto } from '../dto/request/delete-files-by-lab-id.dto';

@Controller('files')
export class FileWriteController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
    private readonly deleteFilesByLabIdUseCase: DeleteFileByLabIdUseCase,
  ) {}

  // TODO: think about getting with decorators message and status for api response dto, and using auto interceptor to skip this creepy creating response class every time
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
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

  @Delete('/:id')
  async deleteFile(@Param() dto: DeleteFileDto): Promise<ApiResponseDto<null>> {
    const { id } = dto;

    await this.deleteFileUseCase.execute(id);

    const response = new ApiResponseDto<null>({
      data: null,
      status: HttpStatus.OK,
      message: `File with ID ${id} has been successfully deleted`,
      timestamp: new Date(),
      path: `/api/files/${id}`,
    });

    return response;
  }

  @Delete()
  async deleteFilesByLabId(
    @Query() dto: DeleteFilesByLabIdDto,
  ): Promise<ApiResponseDto<null>> {
    const { labId } = dto;

    await this.deleteFilesByLabIdUseCase.execute(labId);

    const response = new ApiResponseDto<null>({
      data: null,
      status: HttpStatus.OK,
      message: `All files for laboratory ${labId} have been successfully deleted`,
      timestamp: new Date(),
      path: '/api/files',
    });

    return response;
  }
}
