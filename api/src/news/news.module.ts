import { Module } from '@nestjs/common';
import { ArticlesService } from './services/articles.service';
import { NewsController } from './controllers/news.controller';
import { OpenNewsModule } from 'src/integrations/open-news/open-news.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './common/entity/article.entity';
import { NewsService } from './services/news.service';
import { RecommendationModule } from 'src/recommendation/recommendation.module';

@Module({
  controllers: [NewsController],
  imports: [
    OpenNewsModule,
    TypeOrmModule.forFeature([ArticleEntity]),
    RecommendationModule,
  ],
  providers: [ArticlesService, NewsService],
  exports: [ArticlesService, NewsService],
})
export class NewsModule {}
