export interface NewsSourceDto {
  id: string | null;
  name: string;
}

export interface ArticleDto {
  source: NewsSourceDto;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}
