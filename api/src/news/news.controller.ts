import { Controller, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { IdParamDto } from 'src/common/dto';
import { FeedOptions } from './interface/feed.interface';

@ApiTags('News API')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  async fetchNews(@Query() query: FeedOptions) {
    return this.newsService.getFeed(query);
  }

  async getNewsById(@Param() param: IdParamDto) {
    return this.newsService.getNewsById(param.id);
  }
}
