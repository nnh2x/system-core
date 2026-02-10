import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureEntitlementsEntity } from '../../entities/feature-entitlements.entity';
import {
  SubscriptionsEntity,
  SubscriptionStatus,
} from '../../entities/subscriptions.entity';
import { FeaturesEntity, FeatureType } from '../../entities/features.entity';
import { UsageTrackingEntity } from '../../entities/usage-tracking.entity';
import { PlanFeaturesEntity } from '../../entities/plan-features.entity';

@Injectable()
export class EntitlementService {
  constructor(
    @InjectRepository(FeatureEntitlementsEntity)
    private entitlementsRepository: Repository<FeatureEntitlementsEntity>,
    @InjectRepository(SubscriptionsEntity)
    private subscriptionsRepository: Repository<SubscriptionsEntity>,
    @InjectRepository(FeaturesEntity)
    private featuresRepository: Repository<FeaturesEntity>,
    @InjectRepository(UsageTrackingEntity)
    private usageTrackingRepository: Repository<UsageTrackingEntity>,
    @InjectRepository(PlanFeaturesEntity)
    private planFeaturesRepository: Repository<PlanFeaturesEntity>,
  ) {}

  /**
   * Check if organization has access to a feature
   */
  async checkFeatureAccess(
    organizationId: string,
    featureCode: string,
  ): Promise<{ hasAccess: boolean; value?: string; remaining?: number }> {
    // Get feature
    const feature = await this.featuresRepository.findOne({
      where: { code: featureCode, isActive: true },
    });

    if (!feature) {
      throw new NotFoundException(`Feature '${featureCode}' not found`);
    }

    // Check custom entitlement first (overrides)
    const entitlement = await this.entitlementsRepository.findOne({
      where: {
        organizationId,
        featureId: feature.id,
        isEnabled: true,
      },
    });

    if (entitlement) {
      // Check expiration
      if (entitlement.expiresAt && entitlement.expiresAt < new Date()) {
        return { hasAccess: false };
      }

      return {
        hasAccess: true,
        value: entitlement.value,
      };
    }

    // Check subscription plan features
    const activeSubscription = await this.subscriptionsRepository.findOne({
      where: {
        organizationId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan'],
    });

    if (!activeSubscription) {
      return { hasAccess: false };
    }

    const planFeature = await this.planFeaturesRepository.findOne({
      where: {
        planId: activeSubscription.planId,
        featureId: feature.id,
        isEnabled: true,
      },
    });

    if (!planFeature) {
      return { hasAccess: false };
    }

    // For quota/limit features, check usage
    if (
      feature.type === FeatureType.QUOTA ||
      feature.type === FeatureType.LIMIT
    ) {
      const limit = parseInt(planFeature.value || '0');
      const usage = await this.getCurrentUsage(organizationId, feature.id);

      return {
        hasAccess: usage < limit,
        value: planFeature.value,
        remaining: Math.max(0, limit - usage),
      };
    }

    return {
      hasAccess: true,
      value: planFeature.value,
    };
  }

  /**
   * Assert feature access or throw error
   */
  async assertFeatureAccess(
    organizationId: string,
    featureCode: string,
  ): Promise<void> {
    const result = await this.checkFeatureAccess(organizationId, featureCode);

    if (!result.hasAccess) {
      throw new ForbiddenException(
        `Your plan does not include access to '${featureCode}' feature`,
      );
    }
  }

  /**
   * Record usage for a feature
   */
  async recordUsage(
    organizationId: string,
    featureCode: string,
    userId?: string,
    count: number = 1,
  ): Promise<void> {
    const feature = await this.featuresRepository.findOne({
      where: { code: featureCode },
    });

    if (!feature) {
      throw new NotFoundException(`Feature '${featureCode}' not found`);
    }

    // Get or create usage record for current period
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of month
    const periodEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    ); // End of month

    let usage = await this.usageTrackingRepository.findOne({
      where: {
        organizationId,
        featureId: feature.id,
        periodStart,
      },
    });

    if (!usage) {
      usage = this.usageTrackingRepository.create({
        organizationId,
        featureId: feature.id,
        userId,
        usageCount: 0,
        periodStart,
        periodEnd,
      });
    }

    usage.usageCount = Number(usage.usageCount) + count;

    await this.usageTrackingRepository.save(usage);
  }

  /**
   * Get current usage for a feature in current period
   */
  async getCurrentUsage(
    organizationId: string,
    featureId: string,
  ): Promise<number> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const usage = await this.usageTrackingRepository.findOne({
      where: {
        organizationId,
        featureId,
        periodStart,
      },
    });

    return usage ? Number(usage.usageCount) : 0;
  }

  /**
   * Get usage statistics for organization
   */
  async getUsageStats(organizationId: string) {
    const activeSubscription = await this.subscriptionsRepository.findOne({
      where: {
        organizationId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan', 'plan.planFeatures', 'plan.planFeatures.feature'],
    });

    if (!activeSubscription) {
      return { features: [] };
    }

    const stats = [];

    for (const planFeature of activeSubscription.plan.planFeatures) {
      const feature = planFeature.feature;

      if (
        feature.type === FeatureType.QUOTA ||
        feature.type === FeatureType.LIMIT
      ) {
        const limit = parseInt(planFeature.value || '0');
        const usage = await this.getCurrentUsage(organizationId, feature.id);

        stats.push({
          featureCode: feature.code,
          featureName: feature.name,
          type: feature.type,
          limit,
          usage,
          remaining: Math.max(0, limit - usage),
          unit: feature.unit,
        });
      } else {
        stats.push({
          featureCode: feature.code,
          featureName: feature.name,
          type: feature.type,
          enabled: planFeature.isEnabled,
          value: planFeature.value,
        });
      }
    }

    return {
      organizationId,
      planName: activeSubscription.plan.name,
      features: stats,
    };
  }

  /**
   * Grant custom entitlement to organization
   */
  async grantEntitlement(
    organizationId: string,
    featureCode: string,
    value?: string,
    expiresAt?: Date,
  ) {
    const feature = await this.featuresRepository.findOne({
      where: { code: featureCode },
    });

    if (!feature) {
      throw new NotFoundException(`Feature '${featureCode}' not found`);
    }

    // Check if entitlement already exists
    let entitlement = await this.entitlementsRepository.findOne({
      where: {
        organizationId,
        featureId: feature.id,
      },
    });

    if (entitlement) {
      entitlement.value = value || entitlement.value;
      entitlement.expiresAt = expiresAt || entitlement.expiresAt;
      entitlement.isEnabled = true;
    } else {
      entitlement = this.entitlementsRepository.create({
        organizationId,
        featureId: feature.id,
        value,
        isEnabled: true,
        expiresAt,
      });
    }

    return this.entitlementsRepository.save(entitlement);
  }

  /**
   * Revoke custom entitlement
   */
  async revokeEntitlement(organizationId: string, featureCode: string) {
    const feature = await this.featuresRepository.findOne({
      where: { code: featureCode },
    });

    if (!feature) {
      throw new NotFoundException(`Feature '${featureCode}' not found`);
    }

    const result = await this.entitlementsRepository.delete({
      organizationId,
      featureId: feature.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Entitlement not found');
    }

    return { message: 'Entitlement revoked successfully' };
  }
}
