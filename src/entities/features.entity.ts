import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PlanFeaturesEntity } from './plan-features.entity';

export enum FeatureType {
  BOOLEAN = 'boolean', // On/Off feature
  LIMIT = 'limit', // Numeric limit (e.g., max users, max projects)
  QUOTA = 'quota', // Usage-based quota
  FEATURE_FLAG = 'feature_flag', // Feature flag
}

@Index('idx_feature_code', ['code'], { unique: true })
@Entity('features')
export class FeaturesEntity extends BaseEntity {
  @Column({
    name: 'code',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: FeatureType,
    default: FeatureType.BOOLEAN,
  })
  type: FeatureType;

  @Column({
    name: 'default_value',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  defaultValue: string;

  @Column({ name: 'unit', type: 'varchar', length: 50, nullable: true })
  unit: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => PlanFeaturesEntity, (planFeature) => planFeature.feature)
  planFeatures: PlanFeaturesEntity[];

  @OneToMany('FeatureEntitlementsEntity', 'feature')
  entitlements: any[];
}
