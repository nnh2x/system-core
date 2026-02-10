import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsersEntity } from './users.entity';

export enum OrganizationStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
  TRIAL = 'trial',
}

@Index('idx_organization_slug', ['slug'], { unique: true })
@Index('idx_organization_status', ['status'])
@Entity('organizations')
export class OrganizationsEntity extends BaseEntity {
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

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'logo', type: 'varchar', length: 500, nullable: true })
  logo: string;

  @Column({ name: 'website', type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrganizationStatus,
    default: OrganizationStatus.TRIAL,
  })
  status: OrganizationStatus;

  @Column({ name: 'trial_ends_at', type: 'timestamp', nullable: true })
  trialEndsAt: Date;

  @Column({ name: 'settings', type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => UsersEntity, (user) => user.organization)
  users: UsersEntity[];

  @OneToMany('SubscriptionsEntity', 'organization')
  subscriptions: any[];
}
