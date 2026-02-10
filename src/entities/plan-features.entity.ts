import { Entity, ManyToOne, JoinColumn, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SubscriptionPlansEntity } from './subscription-plans.entity';
import { FeaturesEntity } from './features.entity';

@Index('idx_plan_feature_unique', ['planId', 'featureId'], { unique: true })
@Entity('plan_features')
export class PlanFeaturesEntity extends BaseEntity {
  @Column({ name: 'plan_id', type: 'uuid', nullable: false })
  planId: string;

  @Column({ name: 'feature_id', type: 'uuid', nullable: false })
  featureId: string;

  @Column({ name: 'value', type: 'varchar', length: 255, nullable: true })
  value: string;

  @Column({ name: 'is_enabled', type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => SubscriptionPlansEntity, (plan) => plan.planFeatures)
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlansEntity;

  @ManyToOne(() => FeaturesEntity, (feature) => feature.planFeatures)
  @JoinColumn({ name: 'feature_id' })
  feature: FeaturesEntity;
}
