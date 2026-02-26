import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBase1770761531898 implements MigrationInterface {
  name = 'UpdateBase1770761531898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_by"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_core_users" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_core_users" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_core_users" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_core_users" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_features" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_features" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_features" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_features" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "created_by"`);
    await queryRunner.query(
      `ALTER TABLE "features" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "features" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "usage_tracking" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usage_tracking" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "usage_tracking" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usage_tracking" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "license_keys" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "license_keys" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "license_keys" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "license_keys" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "created_by"`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_entitlements" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_entitlements" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_entitlements" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_entitlements" ADD "updated_by" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "api_keys" DROP COLUMN "created_by"`);
    await queryRunner.query(
      `ALTER TABLE "api_keys" ADD "created_by" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "api_keys" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "api_keys" ADD "updated_by" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "api_keys" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "api_keys" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(`ALTER TABLE "api_keys" DROP COLUMN "created_by"`);
    await queryRunner.query(
      `ALTER TABLE "api_keys" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_entitlements" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_entitlements" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_entitlements" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature_entitlements" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "created_by"`);
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "license_keys" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "license_keys" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "license_keys" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "license_keys" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "usage_tracking" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usage_tracking" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "usage_tracking" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usage_tracking" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "features" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "created_by"`);
    await queryRunner.query(
      `ALTER TABLE "features" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_features" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_features" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_features" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_features" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription_plans" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_core_users" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_core_users" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_core_users" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system_core_users" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_by"`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "created_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "updated_by" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "created_by" character varying(10)`,
    );
  }
}
