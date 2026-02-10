import { Entity, ManyToOne, JoinColumn, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RolesEntity } from './roles.entity';
import { PermissionsEntity } from './permissions.entity';

@Index('idx_role_permission_unique', ['roleId', 'permissionId'], {
  unique: true,
})
@Entity('role_permissions')
export class RolePermissionsEntity extends BaseEntity {
  @Column({ name: 'role_id', type: 'uuid', nullable: false })
  roleId: string;

  @Column({ name: 'permission_id', type: 'uuid', nullable: false })
  permissionId: string;

  @ManyToOne(() => RolesEntity, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: RolesEntity;

  @ManyToOne(
    () => PermissionsEntity,
    (permission) => permission.rolePermissions,
  )
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionsEntity;
}
