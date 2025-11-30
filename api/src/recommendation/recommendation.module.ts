import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRecommendationsEntity } from './entity/user-recommendations.entity';
import { ArticleEntity } from 'src/news/common/entity/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRecommendationsEntity, ArticleEntity]),
  ],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationModule {}
