import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { benchmark } from 'src/common/utils/benchmark';
import { ArticlesService } from 'src/news/services/articles.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly articlesService: ArticlesService) {}

  @Cron(CronExpression.EVERY_4_HOURS)
  async syncNewsCron() {
    this.logger.log('Running cron job: syncLatestNews');

    await benchmark(
      () => this.articlesService.syncLatestNews(),
      'syncLatestNews',
      this.logger,
    );
  }
}
