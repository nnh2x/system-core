import { Entity, ManyToOne, JoinColumn, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsersEntity } from './users.entity';
import { RolesEntity } from './roles.entity';

@Index('idx_user_role_unique', ['userId', 'roleId'], { unique: true })
@Entity('user_roles')
export class UserRolesEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({ name: 'role_id', type: 'uuid', nullable: false })
  roleId: string;

  @Column({ name: 'granted_by', type: 'uuid', nullable: true })
  grantedBy: string;

  @Column({
    name: 'granted_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  grantedAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.userRoles)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => RolesEntity, (role) => role.userRoles)
  @JoinColumn({ name: 'role_id' })
  role: RolesEntity;
}
