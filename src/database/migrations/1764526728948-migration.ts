import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764526728948 implements MigrationInterface {
  name = 'Migration1764526728948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_recommendations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "favorite_categories" jsonb NOT NULL DEFAULT '[]', "favorite_sources" jsonb NOT NULL DEFAULT '[]', "hidden_keywords" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "REL_b65c00f26f1cceff8a096abdf6" UNIQUE ("user_id"), CONSTRAINT "PK_5f708e9f274bb15b9d271a7ea6b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."password" IS 'Hashed password'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_recommendations" ADD CONSTRAINT "FK_b65c00f26f1cceff8a096abdf6f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_recommendations" DROP CONSTRAINT "FK_b65c00f26f1cceff8a096abdf6f"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_recommendations"`);
  }
}
