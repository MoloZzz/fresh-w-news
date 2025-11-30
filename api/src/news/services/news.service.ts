import { Injectable } from '@nestjs/common';
import { RecommendationsService } from 'src/recommendation/recommendation.service';
import { FeedOptionsQuery } from '../common/dto/feed-options.query';
import {
  FindOptionsWhere,
  ILike,
  Between,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { ArticleEntity } from '../common/entity/article.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NewsService {
  constructor(
    private readonly recommendationsService: RecommendationsService,
    @InjectRepository(ArticleEntity)
    private readonly articlesRepository: Repository<ArticleEntity>,
  ) {}

  async getFeed(options: FeedOptionsQuery, userId?: string) {
    if (!userId) {
      return this.getPublicFeed(options);
    }
    return this.getPersonalizedFeed(options, userId);
  }

  private async getPersonalizedFeed(options: FeedOptionsQuery, userId: string) {
    const {
      search,
      author,
      sourceName,
      before,
      after,
      limit = 20,
      offset = 0,
    } = options;

    const prefs = await this.recommendationsService.getUserPreferences(userId);

    const qb = this.articlesRepository
      .createQueryBuilder('a')
      .orderBy('a.publishedAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (search) {
      qb.andWhere('a.title ILIKE :search', { search: `%${search}%` });
    }

    if (author) {
      qb.andWhere('a.author ILIKE :author', { author: `%${author}%` });
    }

    if (sourceName) {
      qb.andWhere('a.sourceName ILIKE :sourceName', {
        sourceName: `%${sourceName}%`,
      });
    }

    if (after && before) {
      qb.andWhere('a.publishedAt BETWEEN :after AND :before', {
        after,
        before,
      });
    } else if (after) {
      qb.andWhere('a.publishedAt > :after', { after });
    } else if (before) {
      qb.andWhere('a.publishedAt < :before', { before });
    }

    if (prefs.categories && prefs.categories.length > 0) {
      qb.andWhere('a.category IN (:...categories)', {
        categories: prefs.categories,
      });
    }

    if (prefs.sources && prefs.sources.length > 0) {
      qb.andWhere('a.sourceName IN (:...sources)', {
        sources: prefs.sources,
      });
    }

    if (prefs.hiddenKeywords && prefs.hiddenKeywords.length > 0) {
      for (const keyword of prefs.hiddenKeywords) {
        qb.andWhere('a.title NOT ILIKE :kw', { kw: `%${keyword}%` });
      }
    }

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  private async getPublicFeed(options: FeedOptionsQuery) {
    const {
      search,
      author,
      sourceName,
      before,
      after,
      limit = 20,
      offset = 0,
    } = options;

    const where: FindOptionsWhere<ArticleEntity> = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }

    if (author) {
      where.author = ILike(`%${author}%`);
    }

    if (sourceName) {
      where.sourceName = ILike(`%${sourceName}%`);
    }

    if (after && before) {
      where.publishedAt = Between(after, before);
    } else if (before) {
      where.publishedAt = LessThan(before);
    } else if (after) {
      where.publishedAt = MoreThan(after);
    }

    const [items, total] = await this.articlesRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: { publishedAt: 'DESC' },
    });

    return { items, total };
  }

  async getArticleById(id: string) {
    return this.articlesRepository.findOneBy({ id });
  }
}
