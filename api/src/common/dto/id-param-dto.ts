import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class IdParamDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  id: string;
}
