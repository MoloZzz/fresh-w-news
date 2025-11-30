import { IsDefined, IsEnum, IsString } from 'class-validator';
import { Action } from '../enum/action.enum';
import { PreferenceField } from '../enum/preference-field.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePreferenceDto {
  @ApiProperty({ enum: PreferenceField })
  @IsDefined()
  @IsEnum(PreferenceField)
  field: PreferenceField;
  @ApiProperty()
  @IsDefined()
  @IsString()
  value: string;
  @ApiProperty({ enum: Action })
  @IsDefined()
  @IsEnum(Action)
  action: Action;
}
