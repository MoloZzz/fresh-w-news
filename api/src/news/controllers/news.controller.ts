import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdParamDto } from 'src/common/dtos';
import { FeedOptionsQuery } from '../common/dto/feed-options.query';
import { NewsService } from '../services/news.service';

@ApiTags('News API')
@Controller('news')
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @Get('feed')
  async fetchNews(@Query() query: FeedOptionsQuery, @Req() req: any) {
    const user = req.user || null;
    return this.service.getFeed(query, user);
  }

  @Get('/article/:id')
  async getNewsById(@Param() param: IdParamDto) {
    return this.service.getArticleById(param.id);
  }
}
