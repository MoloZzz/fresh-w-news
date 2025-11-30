import { Injectable } from '@nestjs/common';
import { RecommendationsService } from 'src/recommendation/recommendation.service';
import { FeedOptionsQuery } from '../common/dto/feed-options.query';
import { ArticlesService } from './articles.service';
import { FindOptionsWhere, ILike, Between, LessThan, MoreThan, Repository } from 'typeorm';
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
    if(userId){
      return this.getPersonalizedFeed(options, userId);
    } else {
      return this.getPublicFeed(options);
    }
  }

  private async getPersonalizedFeed(options: FeedOptionsQuery, userId: string){
    const preferences = await this.recommendationsService.getUserPreferences(userId);
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

    const [items, total] = await this.articlesRepository.findAndCount({ where, take: limit, skip: offset, order: { publishedAt: 'DESC' }, });

    return { items, total };
  }

  async getArticleById(id: string) {
    return this.articlesRepository.findOneBy({ id });
  }
}
