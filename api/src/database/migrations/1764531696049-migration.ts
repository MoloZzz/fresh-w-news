import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764531696049 implements MigrationInterface {
  name = 'Migration1764531696049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "news_articles" ADD "category" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "news_articles" DROP COLUMN "category"`,
    );
  }
}
