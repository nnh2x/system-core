import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrganizationsEntity } from './organizations.entity';
import { FeaturesEntity } from './features.entity';

@Index('idx_entitlement_org_feature', ['organizationId', 'featureId'], {
  unique: true,
})
@Entity('feature_entitlements')
export class FeatureEntitlementsEntity extends BaseEntity {
  @Column({ name: 'organization_id', type: 'uuid', nullable: false })
  organizationId: string;

  @Column({ name: 'feature_id', type: 'uuid', nullable: false })
  featureId: string;

  @Column({ name: 'value', type: 'varchar', length: 255, nullable: true })
  value: string;

  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => OrganizationsEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationsEntity;

  @ManyToOne(() => FeaturesEntity, (feature) => feature.entitlements)
  @JoinColumn({ name: 'feature_id' })
  feature: FeaturesEntity;
}
