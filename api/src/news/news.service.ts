import { Injectable } from '@nestjs/common';
import { OpenNewsService } from 'src/integrations/open-news/open-news.service';

@Injectable()
export class NewsService {
  constructor(private readonly newApi: OpenNewsService) {}

  async getNewsById(id: string) {
    throw new Error('Method not implemented.');
  }

  async fetchLatestNews() {
    throw new Error('Method not implemented.');
  }
}
