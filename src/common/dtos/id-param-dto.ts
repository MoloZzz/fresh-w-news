import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class IdParamDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  id: string;
}
