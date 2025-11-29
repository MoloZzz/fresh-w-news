import { Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { IdParamDto } from 'src/common/dto';

@ApiTags('News API')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  async fetchNews() {
    return this.newsService.fetchLatestNews();
  }

  async getNewsById(@Param() param: IdParamDto) {
    return this.newsService.getNewsById(param.id);
  }
}
