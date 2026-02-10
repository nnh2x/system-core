import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RolePermissionsEntity } from './role-permissions.entity';

@Index('idx_permission_resource_action', ['resource', 'action'], {
  unique: true,
})
@Entity('permissions')
export class PermissionsEntity extends BaseEntity {
  @Column({ name: 'resource', type: 'varchar', length: 100, nullable: false })
  resource: string;

  @Column({ name: 'action', type: 'varchar', length: 50, nullable: false })
  action: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  displayName: string;

  @OneToMany(
    () => RolePermissionsEntity,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermissionsEntity[];
}
