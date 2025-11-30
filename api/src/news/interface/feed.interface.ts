export interface FeedOptions {
  search?: string;
  author?: string;
  sourceName?: string;
  before?: Date;
  after?: Date;
  limit?: number;
  offset?: number;
}
