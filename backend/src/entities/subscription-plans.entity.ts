import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PlanFeaturesEntity } from './plan-features.entity';

export enum PlanType {
  FREE = 'free',
  TRIAL = 'trial',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom',
}

export enum BillingPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime',
}

@Index('idx_plan_slug', ['slug'], { unique: true })
@Index('idx_plan_type', ['type'])
@Entity('subscription_plans')
export class SubscriptionPlansEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    name: 'slug',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: PlanType,
    default: PlanType.FREE,
  })
  type: PlanType;

  @Column({
    name: 'billing_period',
    type: 'enum',
    enum: BillingPeriod,
    default: BillingPeriod.MONTHLY,
  })
  billingPeriod: BillingPeriod;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'trial_days', type: 'int', default: 0 })
  trialDays: number;

  @Column({ name: 'max_users', type: 'int', nullable: true })
  maxUsers: number;

  @Column({ name: 'max_projects', type: 'int', nullable: true })
  maxProjects: number;

  @Column({ name: 'max_storage_gb', type: 'int', nullable: true })
  maxStorageGb: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany('SubscriptionsEntity', 'plan')
  subscriptions: any[];

  @OneToMany(() => PlanFeaturesEntity, (planFeature) => planFeature.plan)
  planFeatures: PlanFeaturesEntity[];
}
