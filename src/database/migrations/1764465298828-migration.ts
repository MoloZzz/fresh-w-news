import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764465298828 implements MigrationInterface {
  name = 'Migration1764465298828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "news_articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "title" character varying NOT NULL, "description" text, "url" text NOT NULL, "urlToImage" character varying, "author" character varying, "sourceName" character varying NOT NULL, "publishedAt" TIMESTAMP NOT NULL, "content" text, CONSTRAINT "PK_ca1b67b1b6b2c382317bbd769dc" PRIMARY KEY ("id")); COMMENT ON COLUMN "news_articles"."externalId" IS 'Url from NewsAPI'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_706b8c2f1963e1d5a3c2eca9f4" ON "news_articles" ("externalId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_706b8c2f1963e1d5a3c2eca9f4"`,
    );
    await queryRunner.query(`DROP TABLE "news_articles"`);
  }
}
