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

/**
 * Query parameters for filtering and paginating news feed results.
 * 
 * @class FeedOptionsQuery
 * 
 * @property {string} [search] - Optional search keyword to filter news articles
 * @property {string} [author] - Optional author name to filter articles by specific author
 * @property {string} [sourceName] - Optional source name to filter articles from specific news sources
 * @property {Date} [before] - Optional date filter to retrieve news published before this date
 * @property {Date} [after] - Optional date filter to retrieve news published after this date
 * @property {number} [limit] - Optional positive integer to limit the maximum number of news articles returned
 * @property {number} [offset] - Optional positive integer for pagination offset to skip results
 */
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
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ required: false, description: 'Offset for pagination' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number;
}
