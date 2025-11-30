import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdParamDto } from 'src/common/dtos';
import { FeedOptionsQuery } from '../common/dto/feed-options.query';
import { NewsService } from '../services/news.service';

@ApiTags('News API')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
  ) {}

  @Get('feed')
  async fetchNews(@Query() query: FeedOptionsQuery) {
    return this.newsService.getFeed(query);
  }

  @Get('/article/:id')
  async getNewsById(@Param() param: IdParamDto) {
    return this.newsService.getArticleById(param.id);
  }
}
