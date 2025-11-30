import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  ILike,
  MoreThan,
  LessThan,
  Between,
} from 'typeorm';
import { OpenNewsService } from 'src/integrations/open-news/open-news.service';
import { ArticleEntity } from './entity/article.entity';
import { ConfigService } from '@nestjs/config';
import { FeedOptions } from './interface/feed.interface';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private readonly country: string;

  constructor(
    private readonly newsApi: OpenNewsService,
    @InjectRepository(ArticleEntity)
    private readonly articlesRepository: Repository<ArticleEntity>,
    private readonly configService: ConfigService,
  ) {
    this.country = this.configService.get<string>(
      'NEWS_DEFAULT_COUNTRY',
      'ukr',
    );
  }

  async syncLatestNews(): Promise<void> {
    this.logger.log('Syncing latest news from external API...');

    const response = await this.newsApi.fetchTopHeadlines({
      country: this.country,
    });
    const articles = response.articles ?? [];

    for (const article of articles) {
      const exists = await this.articlesRepository.exists({
        where: { externalId: article.url },
      });

      if (exists) continue;

      // const entity = this.articlesRepository.create({
      //   externalId: article.url,
      //   title: article.title,
      //   description: article.description,
      //   url: article.url,
      //   urlToImage: article.urlToImage,
      //   author: article.author,
      //   sourceName: article.source?.name,
      //   publishedAt: new Date(article.publishedAt),
      //   content: article.content,
      // });

      // await this.articlesRepository.save(entity);
    }

    this.logger.log(`Sync finished. Imported ${articles.length} articles.`);
  }

  async getFeed(options: FeedOptions) {
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

  async getNewsById(id: string) {
    return this.articlesRepository.findOneBy({ id });
  }
}
