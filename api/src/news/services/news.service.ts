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
  SelectQueryBuilder,
} from 'typeorm';
import { ArticleEntity } from '../common/entity/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPreferences } from 'src/recommendation/dto/user-preferences.dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly recs: RecommendationsService,
    @InjectRepository(ArticleEntity)
    private readonly articlesRepo: Repository<ArticleEntity>,
  ) {}

  async getFeed(options: FeedOptionsQuery, userId?: string) {
    const prefs = userId ? await this.recs.getUserPreferences(userId) : null;
    return this.buildFeedQuery(options, prefs);
  }

  private async buildFeedQuery(
    options: FeedOptionsQuery,
    prefs?: UserPreferences | null,
  ) {
    const qb = this.articlesRepo
      .createQueryBuilder('a')
      .orderBy('a.publishedAt', 'DESC')
      .take(options.limit ?? 20)
      .skip(options.offset ?? 0);

    this.applyBaseFilters(qb, options);

    if (prefs) {
      this.applyUserPreferences(qb, prefs);
    }

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  private applyBaseFilters(
    qb: SelectQueryBuilder<ArticleEntity>,
    opts: FeedOptionsQuery,
  ) {
    if (opts.search) {
      qb.andWhere('a.title ILIKE :search', { search: `%${opts.search}%` });
    }

    if (opts.author) {
      qb.andWhere('a.author ILIKE :author', { author: `%${opts.author}%` });
    }

    if (opts.sourceName) {
      qb.andWhere('a.sourceName ILIKE :sourceName', {
        sourceName: `%${opts.sourceName}%`,
      });
    }

    if (opts.after && opts.before) {
      qb.andWhere('a.publishedAt BETWEEN :after AND :before', {
        after: opts.after,
        before: opts.before,
      });
    } else if (opts.after) {
      qb.andWhere('a.publishedAt > :after', { after: opts.after });
    } else if (opts.before) {
      qb.andWhere('a.publishedAt < :before', { before: opts.before });
    }
  }

  private applyUserPreferences(
    qb: SelectQueryBuilder<ArticleEntity>,
    prefs: UserPreferences,
  ) {
    if (prefs.categories?.length) {
      qb.andWhere('a.category IN (:...categories)', {
        categories: prefs.categories,
      });
    }

    if (prefs.sources?.length) {
      qb.andWhere('a.sourceName IN (:...sources)', {
        sources: prefs.sources,
      });
    }

    if (prefs.hiddenKeywords?.length) {
      qb.andWhere(
        prefs.hiddenKeywords
          .map((_, i) => `a.title NOT ILIKE :kw${i}`)
          .join(' AND '),
        prefs.hiddenKeywords.reduce(
          (acc, kw, i) => ({ ...acc, [`kw${i}`]: `%${kw}%` }),
          {},
        ),
      );
    }
  }

  async getArticleById(id: string) {
    return this.articlesRepo.findOneBy({ id });
  }
}
