import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitlementService } from './entitlement.service';
import { EntitlementController } from './entitlement.controller';
import { FeatureEntitlementsEntity } from '../../entities/feature-entitlements.entity';
import { SubscriptionsEntity } from '../../entities/subscriptions.entity';
import { FeaturesEntity } from '../../entities/features.entity';
import { UsageTrackingEntity } from '../../entities/usage-tracking.entity';
import { PlanFeaturesEntity } from '../../entities/plan-features.entity';
import { UserRolesEntity } from '../../entities/user-roles.entity';
import { RolePermissionsEntity } from '../../entities/role-permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeatureEntitlementsEntity,
      SubscriptionsEntity,
      FeaturesEntity,
      UsageTrackingEntity,
      PlanFeaturesEntity,
      UserRolesEntity,
      RolePermissionsEntity,
    ]),
  ],
  controllers: [EntitlementController],
  providers: [EntitlementService],
  exports: [EntitlementService],
})
export class EntitlementModule {}
