import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    name: 'created_by',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  createdBy: string;

  @Column({
    name: 'updated_by',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  updatedBy: string;
}
