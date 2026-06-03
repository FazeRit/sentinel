import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from 'src/modules/auth/presentation/guards/jwt-access.guard';
import { ApiPaginationMetaResponseDto } from 'src/shared/dto/response/api-pagination-meta-response.dto';
import { ApiResponseDto } from 'src/shared/dto/response/api-response.dto';
import { FindFileByIdUseCase } from '../../application/use-cases/find-file-by-id.usecase';
import { FindFilesUseCase } from '../../application/use-cases/find-files.usecase';
import { FindFileByIdDto } from '../dto/request/find-file-by-id.dto';
import { FindFilesDto } from '../dto/request/find-files.dto';
import { FileResponseDto } from '../dto/response/file-response.dto';

@UseGuards(JwtAccessGuard)
@Controller('files')
export class FileReadController {
  constructor(
    private readonly findFileByIdUseCase: FindFileByIdUseCase,
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

    const files = items.map((file) => FileResponseDto.fromEntity(file));

    const response = new ApiResponseDto<
      Array<FileResponseDto>,
      ApiPaginationMetaResponseDto
    >({
      data: files,
      status: HttpStatus.OK,
      message: 'Files retrieved successfully',
      timestamp: new Date(),
      path: '/files',
      meta: new ApiPaginationMetaResponseDto(
        meta.nextCursor ?? undefined,
        meta.hasNextPage,
        meta.totalItems,
      ),
    });

    return response;
  }

  @Get('/:id')
  async findFile(
    @Param() dto: FindFileByIdDto,
  ): Promise<ApiResponseDto<FileResponseDto>> {
    const { id } = dto;

    const fileEntity = await this.findFileByIdUseCase.execute(id);

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
