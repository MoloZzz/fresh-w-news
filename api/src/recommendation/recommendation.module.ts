import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRecommendationsEntity } from './entity/user-recommendations.entity';
import { ArticleEntity } from 'src/news/common/entity/article.entity';
import { RecommendationController } from './recommendation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRecommendationsEntity, ArticleEntity]),
  ],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
  controllers: [RecommendationController],
})
export class RecommendationModule {}
