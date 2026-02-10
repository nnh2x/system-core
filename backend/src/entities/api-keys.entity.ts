import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsersEntity } from './users.entity';
import { OrganizationsEntity } from './organizations.entity';

@Index('idx_api_key_hash', ['keyHash'], { unique: true })
@Index('idx_api_key_org', ['organizationId'])
@Index('idx_api_key_user', ['userId'])
@Entity('api_keys')
export class ApiKeysEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    name: 'key_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  keyHash: string;

  @Column({ name: 'key_prefix', type: 'varchar', length: 20, nullable: false })
  keyPrefix: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({ name: 'organization_id', type: 'uuid', nullable: false })
  organizationId: string;

  @Column({ name: 'scopes', type: 'jsonb', nullable: true })
  scopes: string[];

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => OrganizationsEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationsEntity;
}
