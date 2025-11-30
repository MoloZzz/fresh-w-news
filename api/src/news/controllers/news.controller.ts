import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdParamDto } from 'src/common/dtos';
import { FeedOptionsQuery } from '../common/dto/feed-options.query';
import { NewsService } from '../services/news.service';
import { OptionalJwtAuthGuard } from 'src/user/guard/optional-jwt.guard';

@ApiTags('News API')
@Controller('news')
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('feed')
  async fetchNews(@Query() query: FeedOptionsQuery, @Req() req: any) {
    const user = req.user ? req.user.userId : null;
    return this.service.getFeed(query, user);
  }

  @Get('/article/:id')
  async getNewsById(@Param() param: IdParamDto) {
    return this.service.getArticleById(param.id);
  }
}
