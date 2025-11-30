import {
  IsOptional,
  IsString,
  IsInt,
  IsDate,
  IsNumber,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FeedOptionsQuery {
  @ApiProperty({ required: false, description: 'Search keyword' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search?: string;

  @ApiProperty({ required: false, description: 'Author name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author?: string;

  @ApiProperty({ required: false, description: 'Source name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sourceName?: string;

  @ApiProperty({
    required: false,
    description: 'Filter news published before this date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  before?: Date;

  @ApiProperty({
    required: false,
    description: 'Filter news published after this date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  after?: Date;

  @ApiProperty({
    required: false,
    description: 'Limit the number of news articles returned',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ required: false, description: 'Offset for pagination' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  offset?: number;
}
