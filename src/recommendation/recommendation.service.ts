import { Injectable } from '@nestjs/common';
import { UserRecommendationsEntity } from './entity/user-recommendations.entity';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/news/common/entity/article.entity';
import { UserPreferences } from './dto/user-preferences.dto';
import { PreferenceField } from './enum/preference-field.enum';
import { Action } from './enum/action.enum';

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

  async updateField(
    userId: string,
    field: PreferenceField,
    value: string,
    action: Action = Action.Add,
  ) {
    let record = await this.recRepo.findOneBy({ userId });
    if (!record) await this.recRepo.save({ userId });
    record = await this.recRepo.findOneBy({ userId }) as UserRecommendationsEntity;

    const arr = record[field] ?? [];

    if (action === Action.Add) {
      if (!arr.includes(value)) arr.push(value);
    } else {
      record[field] = arr.filter((v) => v !== value);
    }

    await this.recRepo.save(record);
  }
}
