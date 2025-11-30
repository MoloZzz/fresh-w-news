import { ArticleDto } from './article.dto';

export interface NewsApiResponse {
  status: 'ok' | 'error';
  totalResults: number;
  articles: ArticleDto[];
}
