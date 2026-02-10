import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { PermissionsGuard } from '../../guards/permissions.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Roles } from '../../decorators/auth.decorator';
import {
  CreateRoleDto,
  UpdateRoleDto,
  AssignRoleDto,
  CreatePermissionDto,
  AssignPermissionDto,
} from '../../dtos/rbac.dto';

@ApiTags('RBAC - Roles & Permissions')
@Controller('rbac')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class RbacController {
  constructor(private rbacService: RbacService) {}

  // ===== ROLES =====

  @Post('roles')
  @Roles('admin')
  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.rbacService.createRole(createRoleDto, organizationId, userId);
  }

  @Get('roles')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all roles in organization' })
  async getRoles(@CurrentUser('organizationId') organizationId: string) {
    return this.rbacService.getRoles(organizationId);
  }

  @Get('roles/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get role by ID' })
  async getRoleById(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.rbacService.getRoleById(id, organizationId);
  }

  @Put('roles/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update role' })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.rbacService.updateRole(id, updateRoleDto, organizationId);
  }

  @Delete('roles/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete role' })
  async deleteRole(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.rbacService.deleteRole(id, organizationId);
  }

  // ===== PERMISSIONS =====

  @Post('permissions')
  @Roles('admin')
  @ApiOperation({ summary: 'Create new permission' })
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.rbacService.createPermission(createPermissionDto, userId);
  }

  @Get('permissions')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all permissions' })
  async getPermissions() {
    return this.rbacService.getPermissions();
  }

  // ===== ROLE PERMISSIONS =====

  @Post('roles/permissions/assign')
  @Roles('admin')
  @ApiOperation({ summary: 'Assign permission to role' })
  async assignPermissionToRole(
    @Body() assignDto: AssignPermissionDto,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.rbacService.assignPermissionToRole(assignDto, organizationId);
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  @Roles('admin')
  @ApiOperation({ summary: 'Remove permission from role' })
  async removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.rbacService.removePermissionFromRole(
      roleId,
      permissionId,
      organizationId,
    );
  }

  // ===== USER ROLES =====

  @Post('users/roles/assign')
  @Roles('admin')
  @ApiOperation({ summary: 'Assign role to user' })
  async assignRoleToUser(
    @Body() assignDto: AssignRoleDto,
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.rbacService.assignRoleToUser(assignDto, organizationId, userId);
  }

  @Delete('users/:userId/roles/:roleId')
  @Roles('admin')
  @ApiOperation({ summary: 'Remove role from user' })
  async removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.rbacService.removeRoleFromUser(userId, roleId, organizationId);
  }

  @Get('users/:userId/roles')
  @ApiOperation({ summary: 'Get user roles' })
  async getUserRoles(@Param('userId') userId: string) {
    return this.rbacService.getUserRoles(userId);
  }

  @Get('users/:userId/permissions')
  @ApiOperation({ summary: 'Get user permissions' })
  async getUserPermissions(@Param('userId') userId: string) {
    return this.rbacService.getUserPermissions(userId);
  }
}
