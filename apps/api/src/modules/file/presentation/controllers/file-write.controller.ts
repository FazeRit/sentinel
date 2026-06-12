import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAccessGuard } from 'src/modules/auth/presentation/guards/jwt-access.guard';
import { CurrentUser } from 'src/shared/presentation/decorators/current-user.decorator';
import { ApiResponseDto } from 'src/shared/presentation/dto/response/api-response.dto';
import { CreateFileUseCase } from '../../application/use-cases/commands/create-file.usecase';
import { SoftDeleteFileByIdUseCase } from '../../application/use-cases/commands/soft-delete-file-by-id.usecase';
import { SoftDeleteFilesUseCase } from '../../application/use-cases/commands/soft-delete-files.usecase';
import { CreateFileDto } from '../dto/request/create-file.dto';
import { DeleteFileByIdDto } from '../dto/request/delete-file-by-id.dto';
import { DeleteFilesDto } from '../dto/request/delete-files.dto';
import { FileResponseDto } from '../dto/response/file-response.dto';

@UseGuards(JwtAccessGuard)
@Controller('files')
export class FileWriteController {
  constructor(
    private readonly createFileUseCase: CreateFileUseCase,
    private readonly softDeleteFileByIdUseCase: SoftDeleteFileByIdUseCase,
    private readonly softDeleteFilesUseCase: SoftDeleteFilesUseCase,
  ) {}

  // TODO: think about getting with decorators message and status for api response dto, and using auto interceptor to skip this creepy creating response class every time
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateFileDto,
    @CurrentUser('id') ownerId: string,
  ): Promise<ApiResponseDto<FileResponseDto>> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const { labId } = dto;

    const fileEntity = await this.createFileUseCase.execute(
      labId,
      ownerId,
      file,
    );

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
  async deleteFile(
    @Param() dto: DeleteFileByIdDto,
  ): Promise<ApiResponseDto<null>> {
    const { id } = dto;

    await this.softDeleteFileByIdUseCase.execute(id);

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
    @Query() dto: DeleteFilesDto,
  ): Promise<ApiResponseDto<null>> {
    const { labId, ownerId } = dto;

    await this.softDeleteFilesUseCase.execute(labId, ownerId);

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
