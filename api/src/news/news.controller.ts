import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { IdParamDto } from 'src/common/dto';
import { FeedOptionsQuery } from './dto/feed-options.query';

@ApiTags('News API')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async fetchNews(@Query() query: FeedOptionsQuery) {
    return this.newsService.getFeed(query);
  }

  @Get(':id')
  async getNewsById(@Param() param: IdParamDto) {
    return this.newsService.getNewsById(param.id);
  }
}
