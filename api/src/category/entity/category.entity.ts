import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'news_categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  label: string;

  @Column({ type: 'varchar' })
  externalColumn: string;
}
