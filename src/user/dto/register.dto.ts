import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;
}
