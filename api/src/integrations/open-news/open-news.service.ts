import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenNewsService {
  private readonly baseUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.baseUrl = 'https://api.opennews.org';
  }

  async fetchLatestNews() {
    // Implementation for fetching latest news from OpenNews API
    throw new Error('Method not implemented.');
  }

  async getNewsById(id: string) {
    // Implementation for fetching news by ID from OpenNews API
    throw new Error('Method not implemented.');
  }
}
