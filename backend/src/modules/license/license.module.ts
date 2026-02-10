import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { SubscriptionPlansEntity } from '../../entities/subscription-plans.entity';
import { FeaturesEntity } from '../../entities/features.entity';
import { PlanFeaturesEntity } from '../../entities/plan-features.entity';
import { SubscriptionsEntity } from '../../entities/subscriptions.entity';
import { LicenseKeysEntity } from '../../entities/license-keys.entity';
import { OrganizationsEntity } from '../../entities/organizations.entity';
import { UserRolesEntity } from '../../entities/user-roles.entity';
import { RolePermissionsEntity } from '../../entities/role-permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionPlansEntity,
      FeaturesEntity,
      PlanFeaturesEntity,
      SubscriptionsEntity,
      LicenseKeysEntity,
      OrganizationsEntity,
      UserRolesEntity,
      RolePermissionsEntity,
    ]),
  ],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService],
})
export class LicenseModule {}
