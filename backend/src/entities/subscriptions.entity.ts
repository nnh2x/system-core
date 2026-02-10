import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrganizationsEntity } from './organizations.entity';
import { SubscriptionPlansEntity } from './subscription-plans.entity';
import { LicenseKeysEntity } from './license-keys.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
}

@Index('idx_subscription_org', ['organizationId'])
@Index('idx_subscription_status', ['status'])
@Index('idx_subscription_expires', ['expiresAt'])
@Entity('subscriptions')
export class SubscriptionsEntity extends BaseEntity {
  @Column({ name: 'organization_id', type: 'uuid', nullable: false })
  organizationId: string;

  @Column({ name: 'plan_id', type: 'uuid', nullable: false })
  planId: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.TRIALING,
  })
  status: SubscriptionStatus;

  @Column({
    name: 'started_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startedAt: Date;

  @Column({ name: 'trial_ends_at', type: 'timestamp', nullable: true })
  trialEndsAt: Date;

  @Column({ name: 'current_period_start', type: 'timestamp', nullable: true })
  currentPeriodStart: Date;

  @Column({ name: 'current_period_end', type: 'timestamp', nullable: true })
  currentPeriodEnd: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ name: 'canceled_at', type: 'timestamp', nullable: true })
  canceledAt: Date;

  @Column({ name: 'auto_renew', type: 'boolean', default: true })
  autoRenew: boolean;

  @Column({
    name: 'payment_provider',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  paymentProvider: string;

  @Column({ name: 'external_id', type: 'varchar', length: 255, nullable: true })
  externalId: string;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(
    () => OrganizationsEntity,
    (organization) => organization.subscriptions,
  )
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationsEntity;

  @ManyToOne(() => SubscriptionPlansEntity, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlansEntity;

  @OneToMany(() => LicenseKeysEntity, (licenseKey) => licenseKey.subscription)
  licenseKeys: LicenseKeysEntity[];
}
