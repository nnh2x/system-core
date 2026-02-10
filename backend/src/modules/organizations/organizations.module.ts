import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsEntity } from '../../entities/organizations.entity';
import { UserRolesEntity } from '../../entities/user-roles.entity';
import { RolePermissionsEntity } from '../../entities/role-permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationsEntity,
      UserRolesEntity,
      RolePermissionsEntity,
    ]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
