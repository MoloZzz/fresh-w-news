import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_recommendations')
export class UserRecommendationsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  favorite_categories: string[];

  @Column({ type: 'jsonb', default: () => "'[]'" })
  favorite_sources: string[];

  @Column({ type: 'jsonb', default: () => "'[]'" })
  hidden_keywords: string[];

  @OneToOne(() => UserEntity, (user) => user.recommendations)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
