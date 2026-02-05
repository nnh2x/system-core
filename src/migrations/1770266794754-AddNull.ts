import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNull1770266794754 implements MigrationInterface {
    name = 'AddNull1770266794754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "system_core_users" ALTER COLUMN "created_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "system_core_users" ALTER COLUMN "updated_by" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "system_core_users" ALTER COLUMN "updated_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "system_core_users" ALTER COLUMN "created_by" SET NOT NULL`);
    }

}
