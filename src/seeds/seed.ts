import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/typeorm';
import { PermissionsEntity } from '../entities/permissions.entity';
import { FeaturesEntity, FeatureType } from '../entities/features.entity';
import {
  SubscriptionPlansEntity,
  PlanType,
  BillingPeriod,
} from '../entities/subscription-plans.entity';
import { PlanFeaturesEntity } from '../entities/plan-features.entity';

async function seed() {
  try {
    const dataSource: DataSource = await AppDataSource.initialize();
    console.log('✅ Database connected');

    // ===== SEED PERMISSIONS =====
    console.log('🌱 Seeding permissions...');
    const permissionsRepository = dataSource.getRepository(PermissionsEntity);

    const permissions = [
      // User permissions
      {
        resource: 'users',
        action: 'create',
        displayName: 'Create Users',
        description: 'Create new users',
      },
      {
        resource: 'users',
        action: 'read',
        displayName: 'Read Users',
        description: 'View users',
      },
      {
        resource: 'users',
        action: 'update',
        displayName: 'Update Users',
        description: 'Update user information',
      },
      {
        resource: 'users',
        action: 'delete',
        displayName: 'Delete Users',
        description: 'Delete users',
      },

      // Organization permissions
      {
        resource: 'organizations',
        action: 'create',
        displayName: 'Create Organizations',
        description: 'Create new organizations',
      },
      {
        resource: 'organizations',
        action: 'read',
        displayName: 'Read Organizations',
        description: 'View organizations',
      },
      {
        resource: 'organizations',
        action: 'update',
        displayName: 'Update Organizations',
        description: 'Update organization details',
      },
      {
        resource: 'organizations',
        action: 'delete',
        displayName: 'Delete Organizations',
        description: 'Delete organizations',
      },

      // Role permissions
      {
        resource: 'roles',
        action: 'create',
        displayName: 'Create Roles',
        description: 'Create new roles',
      },
      {
        resource: 'roles',
        action: 'read',
        displayName: 'Read Roles',
        description: 'View roles',
      },
      {
        resource: 'roles',
        action: 'update',
        displayName: 'Update Roles',
        description: 'Update roles',
      },
      {
        resource: 'roles',
        action: 'delete',
        displayName: 'Delete Roles',
        description: 'Delete roles',
      },
      {
        resource: 'roles',
        action: 'assign',
        displayName: 'Assign Roles',
        description: 'Assign roles to users',
      },

      // License permissions
      {
        resource: 'licenses',
        action: 'create',
        displayName: 'Create Licenses',
        description: 'Create license keys',
      },
      {
        resource: 'licenses',
        action: 'read',
        displayName: 'Read Licenses',
        description: 'View licenses',
      },
      {
        resource: 'licenses',
        action: 'revoke',
        displayName: 'Revoke Licenses',
        description: 'Revoke license keys',
      },

      // Subscription permissions
      {
        resource: 'subscriptions',
        action: 'create',
        displayName: 'Create Subscriptions',
        description: 'Create subscriptions',
      },
      {
        resource: 'subscriptions',
        action: 'read',
        displayName: 'Read Subscriptions',
        description: 'View subscriptions',
      },
      {
        resource: 'subscriptions',
        action: 'update',
        displayName: 'Update Subscriptions',
        description: 'Update subscriptions',
      },
      {
        resource: 'subscriptions',
        action: 'cancel',
        displayName: 'Cancel Subscriptions',
        description: 'Cancel subscriptions',
      },
    ];

    for (const perm of permissions) {
      const existing = await permissionsRepository.findOne({
        where: { resource: perm.resource, action: perm.action },
      });
      if (!existing) {
        await permissionsRepository.save(permissionsRepository.create(perm));
      }
    }
    console.log('✅ Permissions seeded');

    // ===== SEED FEATURES =====
    console.log('🌱 Seeding features...');
    const featuresRepository = dataSource.getRepository(FeaturesEntity);

    const features = [
      // Boolean features
      {
        code: 'api_access',
        name: 'API Access',
        description: 'Access to REST API',
        type: FeatureType.BOOLEAN,
        defaultValue: 'false',
      },
      {
        code: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Access to advanced analytics dashboard',
        type: FeatureType.BOOLEAN,
        defaultValue: 'false',
      },
      {
        code: 'custom_integrations',
        name: 'Custom Integrations',
        description: 'Create custom integrations',
        type: FeatureType.BOOLEAN,
        defaultValue: 'false',
      },
      {
        code: 'priority_support',
        name: 'Priority Support',
        description: '24/7 priority customer support',
        type: FeatureType.BOOLEAN,
        defaultValue: 'false',
      },
      {
        code: 'sso',
        name: 'Single Sign-On',
        description: 'SSO authentication',
        type: FeatureType.BOOLEAN,
        defaultValue: 'false',
      },
      {
        code: 'audit_logs',
        name: 'Audit Logs',
        description: 'Detailed audit logging',
        type: FeatureType.BOOLEAN,
        defaultValue: 'false',
      },

      // Limit features
      {
        code: 'max_users',
        name: 'Max Users',
        description: 'Maximum number of users',
        type: FeatureType.LIMIT,
        defaultValue: '5',
        unit: 'users',
      },
      {
        code: 'max_projects',
        name: 'Max Projects',
        description: 'Maximum number of projects',
        type: FeatureType.LIMIT,
        defaultValue: '3',
        unit: 'projects',
      },
      {
        code: 'max_storage',
        name: 'Max Storage',
        description: 'Maximum storage space',
        type: FeatureType.LIMIT,
        defaultValue: '10',
        unit: 'GB',
      },

      // Quota features
      {
        code: 'api_requests',
        name: 'API Requests',
        description: 'Monthly API request quota',
        type: FeatureType.QUOTA,
        defaultValue: '1000',
        unit: 'requests',
      },
      {
        code: 'email_notifications',
        name: 'Email Notifications',
        description: 'Monthly email quota',
        type: FeatureType.QUOTA,
        defaultValue: '100',
        unit: 'emails',
      },
    ];

    for (const feat of features) {
      const existing = await featuresRepository.findOne({
        where: { code: feat.code },
      });
      if (!existing) {
        await featuresRepository.save(featuresRepository.create(feat));
      }
    }
    console.log('✅ Features seeded');

    // ===== SEED SUBSCRIPTION PLANS =====
    console.log('🌱 Seeding subscription plans...');
    const plansRepository = dataSource.getRepository(SubscriptionPlansEntity);

    const plans = [
      // Free Plan
      {
        name: 'Free',
        slug: 'free',
        description: 'Perfect for getting started',
        type: PlanType.FREE,
        billingPeriod: BillingPeriod.MONTHLY,
        price: 0,
        trialDays: 0,
        maxUsers: 3,
        maxProjects: 5,
        maxStorageGb: 10,
        isPublic: true,
      },
      // Trial Plan
      {
        name: '14-Day Trial',
        slug: 'trial',
        description: 'Try all features for 14 days',
        type: PlanType.TRIAL,
        billingPeriod: BillingPeriod.MONTHLY,
        price: 0,
        trialDays: 14,
        maxUsers: 10,
        maxProjects: 20,
        maxStorageGb: 50,
        isPublic: true,
      },
      // Basic Plan
      {
        name: 'Basic',
        slug: 'basic',
        description: 'Essential features for small teams',
        type: PlanType.BASIC,
        billingPeriod: BillingPeriod.MONTHLY,
        price: 29,
        trialDays: 7,
        maxUsers: 10,
        maxProjects: 25,
        maxStorageGb: 50,
        isPublic: true,
      },
      // Professional Plan
      {
        name: 'Professional',
        slug: 'professional',
        description: 'Advanced features for growing teams',
        type: PlanType.PROFESSIONAL,
        billingPeriod: BillingPeriod.MONTHLY,
        price: 99,
        trialDays: 14,
        maxUsers: 50,
        maxProjects: 100,
        maxStorageGb: 500,
        isPublic: true,
      },
      // Enterprise Plan
      {
        name: 'Enterprise',
        slug: 'enterprise',
        description: 'Unlimited everything with premium support',
        type: PlanType.ENTERPRISE,
        billingPeriod: BillingPeriod.MONTHLY,
        price: 499,
        trialDays: 30,
        maxUsers: null,
        maxProjects: null,
        maxStorageGb: null,
        isPublic: true,
      },
    ];

    const savedPlans = [];
    for (const plan of plans) {
      let existing = await plansRepository.findOne({
        where: { slug: plan.slug },
      });
      if (!existing) {
        existing = await plansRepository.save(plansRepository.create(plan));
      }
      savedPlans.push(existing);
    }
    console.log('✅ Subscription plans seeded');

    // ===== ASSIGN FEATURES TO PLANS =====
    console.log('🌱 Assigning features to plans...');
    const planFeaturesRepository = dataSource.getRepository(PlanFeaturesEntity);

    const allFeatures = await featuresRepository.find();

    // Free Plan - Limited features
    const freePlan = savedPlans.find((p) => p.slug === 'free');
    await assignFeaturesToPlan(
      planFeaturesRepository,
      freePlan.id,
      allFeatures,
      {
        max_users: '3',
        max_projects: '5',
        max_storage: '10',
        api_requests: '1000',
      },
    );

    // Trial Plan - All features enabled
    const trialPlan = savedPlans.find((p) => p.slug === 'trial');
    await assignFeaturesToPlan(
      planFeaturesRepository,
      trialPlan.id,
      allFeatures,
      {
        api_access: 'true',
        advanced_analytics: 'true',
        custom_integrations: 'true',
        priority_support: 'true',
        max_users: '10',
        max_projects: '20',
        max_storage: '50',
        api_requests: '10000',
        email_notifications: '1000',
      },
    );

    // Basic Plan
    const basicPlan = savedPlans.find((p) => p.slug === 'basic');
    await assignFeaturesToPlan(
      planFeaturesRepository,
      basicPlan.id,
      allFeatures,
      {
        api_access: 'true',
        max_users: '10',
        max_projects: '25',
        max_storage: '50',
        api_requests: '5000',
        email_notifications: '500',
      },
    );

    // Professional Plan
    const proPlan = savedPlans.find((p) => p.slug === 'professional');
    await assignFeaturesToPlan(
      planFeaturesRepository,
      proPlan.id,
      allFeatures,
      {
        api_access: 'true',
        advanced_analytics: 'true',
        custom_integrations: 'true',
        audit_logs: 'true',
        max_users: '50',
        max_projects: '100',
        max_storage: '500',
        api_requests: '50000',
        email_notifications: '5000',
      },
    );

    // Enterprise Plan
    const enterprisePlan = savedPlans.find((p) => p.slug === 'enterprise');
    await assignFeaturesToPlan(
      planFeaturesRepository,
      enterprisePlan.id,
      allFeatures,
      {
        api_access: 'true',
        advanced_analytics: 'true',
        custom_integrations: 'true',
        priority_support: 'true',
        sso: 'true',
        audit_logs: 'true',
        max_users: '999999',
        max_projects: '999999',
        max_storage: '999999',
        api_requests: '999999',
        email_notifications: '999999',
      },
    );

    console.log('✅ Features assigned to plans');
    console.log('✨ Seed completed successfully!');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

async function assignFeaturesToPlan(
  repository: any,
  planId: string,
  allFeatures: FeaturesEntity[],
  featureValues: Record<string, string>,
) {
  for (const [code, value] of Object.entries(featureValues)) {
    const feature = allFeatures.find((f) => f.code === code);
    if (!feature) continue;

    const existing = await repository.findOne({
      where: { planId, featureId: feature.id },
    });

    if (!existing) {
      await repository.save(
        repository.create({
          planId,
          featureId: feature.id,
          value,
          isEnabled: true,
        }),
      );
    }
  }
}

seed();
