import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { NewsCategoriesEnum } from '../enums/news-categories.enum';

@Entity('news_articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', comment: 'Url from NewsAPI' })
  externalId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ nullable: true })
  urlToImage: string;

  @Column({ nullable: true })
  author: string;

  @Column({ type: 'varchar' })
  sourceName: string;

  @Column({ type: 'timestamp' })
  publishedAt: Date;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  category: NewsCategoriesEnum;
}
