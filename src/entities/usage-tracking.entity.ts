import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrganizationsEntity } from './organizations.entity';
import { FeaturesEntity } from './features.entity';
import { UsersEntity } from './users.entity';

@Index('idx_usage_org_feature_period', [
  'organizationId',
  'featureId',
  'periodStart',
])
@Entity('usage_tracking')
export class UsageTrackingEntity extends BaseEntity {
  @Column({ name: 'organization_id', type: 'uuid', nullable: false })
  organizationId: string;

  @Column({ name: 'feature_id', type: 'uuid', nullable: false })
  featureId: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ name: 'usage_count', type: 'bigint', default: 0 })
  usageCount: number;

  @Column({ name: 'period_start', type: 'timestamp', nullable: false })
  periodStart: Date;

  @Column({ name: 'period_end', type: 'timestamp', nullable: false })
  periodEnd: Date;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => OrganizationsEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationsEntity;

  @ManyToOne(() => FeaturesEntity)
  @JoinColumn({ name: 'feature_id' })
  feature: FeaturesEntity;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
