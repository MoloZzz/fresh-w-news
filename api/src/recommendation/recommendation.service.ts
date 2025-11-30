import { Injectable } from '@nestjs/common';
import { UserRecommendationsEntity } from './entity/user-recommendations.entity';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/news/common/entity/article.entity';
import { UserPreferences } from './dto/user-preferences.dto';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(UserRecommendationsEntity)
    private readonly recRepo: Repository<UserRecommendationsEntity>,
  ) {}

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const record = await this.recRepo.findOne({
      where: { userId },
    });
    if (!record) {
      return null;
    }

    return {
      categories: record.favorite_categories,
      sources: record.favorite_sources,
      hiddenKeywords: record.hidden_keywords,
    };
  }
}
