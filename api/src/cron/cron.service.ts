import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { benchmark } from 'src/common/utils/benchmark';
import { NewsService } from 'src/news/news.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly newsService: NewsService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncNewsCron() {
    this.logger.log('Running cron job: syncLatestNews');

    await benchmark(
      () => this.newsService.syncLatestNews(),
      'syncLatestNews',
      this.logger,
    );
  }
}
