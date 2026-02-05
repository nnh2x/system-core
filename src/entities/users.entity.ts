import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('system_core_users')
export class UsersEntity extends BaseEntity {
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
}
