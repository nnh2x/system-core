import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1770265396466 implements MigrationInterface {
  name = 'InitDatabase1770265396466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "system_core_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(10) NOT NULL, "updated_by" character varying(10) NOT NULL, "user_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "full_name" character varying(255) NOT NULL, "code" character varying(100) NOT NULL, "phone" character varying(15), "avatar" character varying(500), "date_of_birth" TIMESTAMP, CONSTRAINT "PK_429d52794e0cbd3b274172c700c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "system_core_users"`);
  }
}
