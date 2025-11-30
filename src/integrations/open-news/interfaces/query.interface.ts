export interface EverythingQuery {
  q: string;
  from?: string;
  to?: string;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
  page?: number;
  pageSize?: number;
}

export interface TopHeadlinesQuery {
  country?: string; // 'us'
  category?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}
