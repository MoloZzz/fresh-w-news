import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { OpenNewsService } from 'src/integrations/open-news/open-news.service';
import { ArticleEntity } from '../common/entity/article.entity';
import { ConfigService } from '@nestjs/config';
import { NewsCategoriesEnum } from '../common/enums/news-categories.enum';
import { ArticleDto } from 'src/integrations/open-news/interfaces/article.dto';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  private readonly country: string;

  constructor(
    private readonly newsApi: OpenNewsService,
    @InjectRepository(ArticleEntity)
    private readonly articlesRepo: Repository<ArticleEntity>,
    private readonly configService: ConfigService,
  ) {
    this.country = this.configService.get<string>('NEWS_DEFAULT_COUNTRY', 'ua');
  }

  async syncLatestNews(): Promise<void> {
    this.logger.log('Syncing latest news from external API...');

    const categories = Object.values(NewsCategoriesEnum);
    const allNewArticles: DeepPartial<ArticleEntity>[] = [];

    const existing = await this.articlesRepo.find({
      select: ['externalId'],
    });
    const existingIds = new Set(existing.map((a) => a.externalId));

    for (const category of categories) {
      this.logger.log(`Fetching category: ${category}`);

      const response = await this.newsApi.fetchTopHeadlines({
        country: this.country,
        category,
      });

      const articles: ArticleDto[] = response.articles ?? [];

      for (const article of articles) {
        if (existingIds.has(article.url)) continue;

        existingIds.add(article.url);

        allNewArticles.push({
          externalId: article.url,
          title: article.title,
          description: article.description ?? undefined,
          url: article.url,
          urlToImage: article.urlToImage ?? undefined,
          author: article.author ?? undefined,
          sourceName: article.source?.name,
          publishedAt: new Date(article.publishedAt),
          content: article.content ?? undefined,
          category,
        });
      }
    }

    if (allNewArticles.length > 0) {
      await this.articlesRepo.save(allNewArticles);
    }

    this.logger.log(
      `Sync finished. Imported ${allNewArticles.length} new articles.`,
    );
  }
}
