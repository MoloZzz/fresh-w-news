import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeepPartial,
} from 'typeorm';
import { OpenNewsService } from 'src/integrations/open-news/open-news.service';
import { ArticleEntity } from '../common/entity/article.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  private readonly country: string;

  constructor(
    private readonly newsApi: OpenNewsService,
    @InjectRepository(ArticleEntity)
    private readonly articlesRepository: Repository<ArticleEntity>,
    private readonly configService: ConfigService,
  ) {
    this.country = this.configService.get<string>('NEWS_DEFAULT_COUNTRY', 'ua');
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

      const entity = this.articlesRepository.create({
        externalId: article.url,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        author: article.author,
        sourceName: article.source?.name,
        publishedAt: new Date(article.publishedAt),
        content: article.content,
      } as DeepPartial<ArticleEntity>);

      await this.articlesRepository.save(entity);
    }

    this.logger.log(`Sync finished. Imported ${articles.length} articles.`);
  }
}
