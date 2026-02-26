import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SubscriptionPlansEntity } from '../../entities/subscription-plans.entity';
import { FeaturesEntity } from '../../entities/features.entity';
import { PlanFeaturesEntity } from '../../entities/plan-features.entity';
import {
  SubscriptionsEntity,
  SubscriptionStatus,
} from '../../entities/subscriptions.entity';
import {
  LicenseKeysEntity,
  LicenseKeyStatus,
} from '../../entities/license-keys.entity';
import {
  OrganizationsEntity,
  OrganizationStatus,
} from '../../entities/organizations.entity';
import {
  CreateSubscriptionPlanDto,
  CreateFeatureDto,
  AssignFeatureToPlanDto,
  CreateSubscriptionDto,
  CreateLicenseKeyDto,
} from '../../dtos/license.dto';
import * as crypto from 'crypto';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(SubscriptionPlansEntity)
    private plansRepository: Repository<SubscriptionPlansEntity>,
    @InjectRepository(FeaturesEntity)
    private featuresRepository: Repository<FeaturesEntity>,
    @InjectRepository(PlanFeaturesEntity)
    private planFeaturesRepository: Repository<PlanFeaturesEntity>,
    @InjectRepository(SubscriptionsEntity)
    private subscriptionsRepository: Repository<SubscriptionsEntity>,
    @InjectRepository(LicenseKeysEntity)
    private licenseKeysRepository: Repository<LicenseKeysEntity>,
    @InjectRepository(OrganizationsEntity)
    private organizationsRepository: Repository<OrganizationsEntity>,
    private dataSource: DataSource,
  ) {}

  // ===== SUBSCRIPTION PLANS =====

  async createPlan(createDto: CreateSubscriptionPlanDto, createdBy: string) {
    const slug = createDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await this.plansRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Plan with this name already exists');
    }

    const plan = this.plansRepository.create({
      ...createDto,
      slug,
      createdBy,
    });

    return this.plansRepository.save(plan);
  }

  async getPlans(isPublic?: boolean) {
    const where =
      isPublic !== undefined
        ? { isPublic, isActive: true }
        : { isActive: true };
    const plans = await this.plansRepository.find({
      where,
      relations: ['planFeatures', 'planFeatures.feature'],
    });

    return plans.map((plan) => {
      const { planFeatures, ...rest } = plan;
      return {
        ...rest,
        features: planFeatures.map((pf) => ({
          id: pf.feature.id,
          name: pf.feature.name,
          code: pf.feature.code,
          description: pf.feature.description,
        })),
      };
    });
  }

  async getPlanById(id: string) {
    const plan = await this.plansRepository.findOne({
      where: { id },
      relations: ['planFeatures', 'planFeatures.feature'],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  // ===== FEATURES =====

  async createFeature(createDto: CreateFeatureDto, createdBy: string) {
    const existing = await this.featuresRepository.findOne({
      where: { code: createDto.code },
    });
    if (existing) {
      throw new ConflictException('Feature with this code already exists');
    }

    const feature = this.featuresRepository.create({
      ...createDto,
      createdBy,
    });

    return this.featuresRepository.save(feature);
  }

  async getFeatures() {
    return this.featuresRepository.find({ where: { isActive: true } });
  }

  async getFeatureById(id: string) {
    const feature = await this.featuresRepository.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException('Feature not found');
    }
    return feature;
  }

  // ===== PLAN FEATURES =====

  async assignFeatureToPlan(assignDto: AssignFeatureToPlanDto) {
    await this.getPlanById(assignDto.planId);
    await this.getFeatureById(assignDto.featureId);

    const existing = await this.planFeaturesRepository.findOne({
      where: {
        planId: assignDto.planId,
        featureId: assignDto.featureId,
      },
    });

    if (existing) {
      throw new ConflictException('Feature already assigned to this plan');
    }

    const planFeature = this.planFeaturesRepository.create(assignDto);
    return this.planFeaturesRepository.save(planFeature);
  }

  async removeFeatureFromPlan(planId: string, featureId: string) {
    const result = await this.planFeaturesRepository.delete({
      planId,
      featureId,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Feature assignment not found');
    }
    return { message: 'Feature removed from plan' };
  }

  // ===== SUBSCRIPTIONS =====

  async createSubscription(
    createDto: CreateSubscriptionDto,
    createdBy: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const organization = await this.organizationsRepository.findOne({
        where: { id: createDto.organizationId },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      const plan = await this.getPlanById(createDto.planId);

      // Check for active subscription
      const activeSubscription = await this.subscriptionsRepository.findOne({
        where: {
          organizationId: createDto.organizationId,
          status: SubscriptionStatus.ACTIVE,
        },
      });

      if (activeSubscription) {
        throw new ConflictException(
          'Organization already has an active subscription',
        );
      }

      const now = new Date();
      const trialDays = plan.trialDays || 0;
      const trialEndsAt =
        trialDays > 0
          ? new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000)
          : null;

      const subscription = this.subscriptionsRepository.create({
        organizationId: createDto.organizationId,
        planId: createDto.planId,
        status:
          trialDays > 0
            ? SubscriptionStatus.TRIALING
            : SubscriptionStatus.ACTIVE,
        startedAt: now,
        trialEndsAt,
        currentPeriodStart: now,
        currentPeriodEnd: this.calculatePeriodEnd(now, plan.billingPeriod),
        autoRenew: createDto.autoRenew ?? true,
        createdBy,
      });

      const savedSubscription = await queryRunner.manager.save(subscription);

      // Update organization status
      organization.status =
        trialDays > 0 ? OrganizationStatus.TRIAL : OrganizationStatus.ACTIVE;
      organization.trialEndsAt = trialEndsAt;
      await queryRunner.manager.save(organization);

      // Generate license key
      const licenseKey = await this.generateLicenseKey(
        savedSubscription.id,
        organization.id,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return {
        subscription: savedSubscription,
        licenseKey,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getSubscriptionsByOrganization(organizationId: string) {
    return this.subscriptionsRepository.find({
      where: { organizationId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSubscriptionById(id: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
      relations: ['plan', 'organization', 'licenseKeys'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async cancelSubscription(id: string) {
    const subscription = await this.getSubscriptionById(id);

    if (subscription.status === SubscriptionStatus.CANCELED) {
      throw new BadRequestException('Subscription is already canceled');
    }

    subscription.status = SubscriptionStatus.CANCELED;
    subscription.canceledAt = new Date();
    subscription.autoRenew = false;

    return this.subscriptionsRepository.save(subscription);
  }

  // ===== LICENSE KEYS =====

  private async generateLicenseKey(
    subscriptionId: string,
    organizationId: string,
    queryRunner?: any,
  ) {
    const random = crypto.randomBytes(16).toString('hex');
    const key = `LIC-${random.toUpperCase()}`;

    const licenseKey = this.licenseKeysRepository.create({
      licenseKey: key,
      subscriptionId,
      organizationId,
      status: LicenseKeyStatus.ACTIVE,
    });

    if (queryRunner) {
      return queryRunner.manager.save(licenseKey);
    }

    return this.licenseKeysRepository.save(licenseKey);
  }

  async createLicenseKey(createDto: CreateLicenseKeyDto) {
    const subscription = await this.getSubscriptionById(
      createDto.subscriptionId,
    );

    return this.generateLicenseKey(
      subscription.id,
      subscription.organizationId,
    );
  }

  async validateLicenseKey(licenseKey: string) {
    const license = await this.licenseKeysRepository.findOne({
      where: { licenseKey },
      relations: ['subscription', 'subscription.plan', 'organization'],
    });

    if (!license) {
      throw new NotFoundException('Invalid license key');
    }

    if (license.status !== LicenseKeyStatus.ACTIVE) {
      throw new BadRequestException('License key is not active');
    }

    if (license.expiresAt && license.expiresAt < new Date()) {
      throw new BadRequestException('License key has expired');
    }

    if (license.subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Subscription is not active');
    }

    // Update last validated
    license.lastValidatedAt = new Date();
    await this.licenseKeysRepository.save(license);

    return {
      valid: true,
      organization: {
        id: license.organization.id,
        name: license.organization.name,
      },
      plan: {
        id: license.subscription.plan.id,
        name: license.subscription.plan.name,
        type: license.subscription.plan.type,
      },
      subscription: {
        id: license.subscription.id,
        status: license.subscription.status,
        expiresAt: license.subscription.expiresAt,
      },
    };
  }

  private calculatePeriodEnd(start: Date, billingPeriod: string): Date {
    const end = new Date(start);

    switch (billingPeriod) {
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'quarterly':
        end.setMonth(end.getMonth() + 3);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
      case 'lifetime':
        end.setFullYear(end.getFullYear() + 100);
        break;
    }

    return end;
  }
}
