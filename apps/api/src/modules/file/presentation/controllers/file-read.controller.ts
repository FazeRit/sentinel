import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiPaginationMetaResponseDto } from 'src/shared/dto/response/api-paginition-meta-response.dto';
import { ApiResponseDto } from 'src/shared/dto/response/api-response.dto';
import { FindFileUseCase } from '../../application/use-cases/find-file.usecase';
import { FindFilesUseCase } from '../../application/use-cases/find-files.usecase';
import { FindFileDto } from '../dto/request/find-file.dto';
import { FindFilesDto } from '../dto/request/find-files.dto';
import { FileResponseDto } from '../dto/response/file-response.dto';

@Controller('files')
export class FileReadController {
  constructor(
    private readonly findFileUseCase: FindFileUseCase,
    private readonly findFilesUseCase: FindFilesUseCase,
  ) {}

  @Get()
  async findFiles(
    @Query() dto: FindFilesDto,
  ): Promise<
    ApiResponseDto<Array<FileResponseDto>, ApiPaginationMetaResponseDto>
  > {
    const { labId, ownerId, cursor, limit } = dto;

    const { items, meta } = await this.findFilesUseCase.execute(
      labId,
      ownerId,
      cursor,
      limit,
    );

    const response = new ApiResponseDto<
      Array<FileResponseDto>,
      ApiPaginationMetaResponseDto
    >({
      data: items,
      status: HttpStatus.OK,
      message: 'Files retrieved successfully',
      timestamp: new Date(),
      path: '/files',
      meta,
    });

    return response;
  }

  @Get('/:id')
  async findFile(
    @Param() dto: FindFileDto,
  ): Promise<ApiResponseDto<FileResponseDto>> {
    const { id } = dto;

    const fileEntity = await this.findFileUseCase.execute(id);

    const data = FileResponseDto.fromEntity(fileEntity);

    const response = new ApiResponseDto<FileResponseDto>({
      data,
      status: HttpStatus.OK,
      message: 'File found successfully',
      timestamp: new Date(),
      path: `/files/${id}`,
    });

    return response;
  }
}
