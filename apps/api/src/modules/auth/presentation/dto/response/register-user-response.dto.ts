import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/modules/users/presentation/dto/response/user-response.dto';

export class RegisterUserResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
