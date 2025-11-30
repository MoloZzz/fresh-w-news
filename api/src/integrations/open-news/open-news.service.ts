import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { NewsApiResponse } from './interfaces/response.interface';
import {
  EverythingQuery,
  TopHeadlinesQuery,
} from './interfaces/query.interface';

@Injectable()
export class OpenNewsService {
  private readonly logger = new Logger(OpenNewsService.name);
  private readonly http: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('NEWS_API_KEY')!;
    this.baseUrl = this.configService.get<string>(
      'NEWS_API_URL',
      'https://newsapi.org/v2',
    )!;

    if (!this.apiKey) {
      throw new Error('NEWS_API_KEY is not defined in the configuration');
    }

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-Api-Key': this.apiKey,
      },
      timeout: 10_000,
    });
  }

  private logRequest(endpoint: string, params: unknown): void {
    this.logger.debug(
      `Request: ${endpoint} | params=${JSON.stringify(params)}`,
    );
  }

  private handleError(error: AxiosError): never {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as Record<string, any>;

      this.logger.error(`Error response: ${status} ${JSON.stringify(data)}`);

      throw new HttpException(data, status);
    }

    this.logger.error(`Axios error: ${error.message}`);
    throw new InternalServerErrorException('Failed to call News API');
  }

  private async get<T>(endpoint: string, params?: unknown): Promise<T> {
    this.logRequest(endpoint, params);
    try {
      const { data } = await this.http.get<T>(endpoint, { params });
      return data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async fetchEverything(query: EverythingQuery): Promise<NewsApiResponse> {
    return this.get<NewsApiResponse>('everything', query);
  }

  async fetchTopHeadlines(query: TopHeadlinesQuery): Promise<NewsApiResponse> {
    return this.get<NewsApiResponse>('top-headlines', query);
  }
}
