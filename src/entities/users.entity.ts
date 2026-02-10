import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrganizationsEntity } from './organizations.entity';
import { UserRolesEntity } from './user-roles.entity';
import * as bcrypt from 'bcrypt';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

@Index('idx_user_email', ['email'], { unique: true })
@Index('idx_user_code_phone', ['code', 'phone'], { unique: true })
@Index('idx_user_created_at', ['createdAt'])
@Index('idx_user_organization', ['organizationId'])
@Entity('system_core_users')
export class UsersEntity extends BaseEntity {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ name: 'user_name', type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: false })
  fullName: string;

  @Column({ name: 'code', type: 'varchar', length: 100, nullable: false })
  code: string;

  @Column({ name: 'phone', type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ name: 'avatar', type: 'varchar', length: 500, nullable: true })
  avatar: string;

  @Column({ name: 'date_of_birth', type: 'timestamp', nullable: true })
  dateOfBirth: string;

  @Column({ name: 'organization_id', type: 'uuid', nullable: false })
  organizationId: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'two_factor_enabled', type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({
    name: 'two_factor_secret',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  twoFactorSecret: string;

  @ManyToOne(() => OrganizationsEntity, (organization) => organization.users)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationsEntity;

  @OneToMany(() => UserRolesEntity, (userRole) => userRole.user)
  userRoles: UserRolesEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
