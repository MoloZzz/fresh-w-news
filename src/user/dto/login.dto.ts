import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
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
