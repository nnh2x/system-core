import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { RolesEntity } from '../../entities/roles.entity';
import { PermissionsEntity } from '../../entities/permissions.entity';
import { UserRolesEntity } from '../../entities/user-roles.entity';
import { RolePermissionsEntity } from '../../entities/role-permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RolesEntity,
      PermissionsEntity,
      UserRolesEntity,
      RolePermissionsEntity,
    ]),
  ],
  controllers: [RbacController],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
