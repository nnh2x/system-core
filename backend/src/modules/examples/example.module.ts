import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { EntitlementModule } from '../entitlement/entitlement.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesEntity } from '../../entities/user-roles.entity';
import { RolePermissionsEntity } from '../../entities/role-permissions.entity';

@Module({
  imports: [
    EntitlementModule,
    TypeOrmModule.forFeature([UserRolesEntity, RolePermissionsEntity]),
  ],
  controllers: [ExampleController],
})
export class ExampleModule {}
