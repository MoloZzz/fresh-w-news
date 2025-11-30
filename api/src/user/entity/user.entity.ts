import { UserRecommendationsEntity } from 'src/recommendation/entity/user-recommendations.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', comment: 'Hashed password' })
  password: string;

  @OneToOne(() => UserRecommendationsEntity, (r) => r.user, { cascade: true })
  recommendations: UserRecommendationsEntity;
}
