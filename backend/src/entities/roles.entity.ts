import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrganizationsEntity } from './organizations.entity';
import { UserRolesEntity } from './user-roles.entity';
import { RolePermissionsEntity } from './role-permissions.entity';

export enum RoleType {
  SYSTEM = 'system', // Roles hệ thống (super admin, system roles)
  ORGANIZATION = 'organization', // Roles cho organization
}

@Index('idx_role_org_name', ['organizationId', 'name'], { unique: true })
@Index('idx_role_type', ['type'])
@Entity('roles')
export class RolesEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  displayName: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: RoleType,
    default: RoleType.ORGANIZATION,
  })
  type: RoleType;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ name: 'organization_id', type: 'uuid', nullable: true })
  organizationId: string;

  @ManyToOne(() => OrganizationsEntity)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationsEntity;

  @OneToMany(() => UserRolesEntity, (userRole) => userRole.role)
  userRoles: UserRolesEntity[];

  @OneToMany(
    () => RolePermissionsEntity,
    (rolePermission) => rolePermission.role,
  )
  rolePermissions: RolePermissionsEntity[];
}
