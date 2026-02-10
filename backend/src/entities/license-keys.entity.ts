import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SubscriptionsEntity } from './subscriptions.entity';
import { OrganizationsEntity } from './organizations.entity';

export enum LicenseKeyStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
}

@Index('idx_license_key', ['licenseKey'], { unique: true })
@Index('idx_license_org', ['organizationId'])
@Index('idx_license_status', ['status'])
@Entity('license_keys')
export class LicenseKeysEntity extends BaseEntity {
  @Column({
    name: 'license_key',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  licenseKey: string;

  @Column({ name: 'organization_id', type: 'uuid', nullable: false })
  organizationId: string;

  @Column({ name: 'subscription_id', type: 'uuid', nullable: false })
  subscriptionId: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: LicenseKeyStatus,
    default: LicenseKeyStatus.ACTIVE,
  })
  status: LicenseKeyStatus;

  @Column({
    name: 'issued_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  issuedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ name: 'last_validated_at', type: 'timestamp', nullable: true })
  lastValidatedAt: Date;

  @Column({ name: 'activation_count', type: 'int', default: 0 })
  activationCount: number;

  @Column({ name: 'max_activations', type: 'int', nullable: true })
  maxActivations: number;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => OrganizationsEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationsEntity;

  @ManyToOne(
    () => SubscriptionsEntity,
    (subscription) => subscription.licenseKeys,
  )
  @JoinColumn({ name: 'subscription_id' })
  subscription: SubscriptionsEntity;
}
