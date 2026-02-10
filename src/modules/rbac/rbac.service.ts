import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity, RoleType } from '../../entities/roles.entity';
import { PermissionsEntity } from '../../entities/permissions.entity';
import { UserRolesEntity } from '../../entities/user-roles.entity';
import { RolePermissionsEntity } from '../../entities/role-permissions.entity';
import {
  CreateRoleDto,
  UpdateRoleDto,
  AssignRoleDto,
  CreatePermissionDto,
  AssignPermissionDto,
} from '../../dtos/rbac.dto';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>,
    @InjectRepository(PermissionsEntity)
    private permissionsRepository: Repository<PermissionsEntity>,
    @InjectRepository(UserRolesEntity)
    private userRolesRepository: Repository<UserRolesEntity>,
    @InjectRepository(RolePermissionsEntity)
    private rolePermissionsRepository: Repository<RolePermissionsEntity>,
  ) {}

  // ===== ROLES =====

  async createRole(
    createRoleDto: CreateRoleDto,
    organizationId: string,
    createdBy: string,
  ) {
    const existing = await this.rolesRepository.findOne({
      where: {
        name: createRoleDto.name,
        organizationId,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Role with this name already exists in organization',
      );
    }

    const role = this.rolesRepository.create({
      ...createRoleDto,
      organizationId,
      type: createRoleDto.type || RoleType.ORGANIZATION,
      createdBy,
    });

    return this.rolesRepository.save(role);
  }

  async getRoles(organizationId: string) {
    return this.rolesRepository.find({
      where: { organizationId },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
  }

  async getRoleById(id: string, organizationId: string) {
    const role = await this.rolesRepository.findOne({
      where: { id, organizationId },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
    organizationId: string,
  ) {
    const role = await this.getRoleById(id, organizationId);

    Object.assign(role, updateRoleDto);
    return this.rolesRepository.save(role);
  }

  async deleteRole(id: string, organizationId: string) {
    const role = await this.getRoleById(id, organizationId);

    // Check if role is assigned to users
    const assignedCount = await this.userRolesRepository.count({
      where: { roleId: id },
    });

    if (assignedCount > 0) {
      throw new BadRequestException(
        `Cannot delete role. It is assigned to ${assignedCount} user(s)`,
      );
    }

    // Delete role permissions first
    await this.rolePermissionsRepository.delete({ roleId: id });

    await this.rolesRepository.remove(role);
    return { message: 'Role deleted successfully' };
  }

  // ===== PERMISSIONS =====

  async createPermission(
    createPermissionDto: CreatePermissionDto,
    createdBy: string,
  ) {
    const existing = await this.permissionsRepository.findOne({
      where: {
        resource: createPermissionDto.resource,
        action: createPermissionDto.action,
      },
    });

    if (existing) {
      throw new ConflictException('Permission already exists');
    }

    const permission = this.permissionsRepository.create({
      ...createPermissionDto,
      createdBy,
    });

    return this.permissionsRepository.save(permission);
  }

  async getPermissions() {
    return this.permissionsRepository.find();
  }

  async getPermissionById(id: string) {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  // ===== ROLE PERMISSIONS =====

  async assignPermissionToRole(
    assignDto: AssignPermissionDto,
    organizationId: string,
  ) {
    await this.getRoleById(assignDto.roleId, organizationId);
    await this.getPermissionById(assignDto.permissionId);

    const existing = await this.rolePermissionsRepository.findOne({
      where: {
        roleId: assignDto.roleId,
        permissionId: assignDto.permissionId,
      },
    });

    if (existing) {
      throw new ConflictException('Permission already assigned to this role');
    }

    const rolePermission = this.rolePermissionsRepository.create({
      roleId: assignDto.roleId,
      permissionId: assignDto.permissionId,
    });

    return this.rolePermissionsRepository.save(rolePermission);
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
    organizationId: string,
  ) {
    await this.getRoleById(roleId, organizationId);

    const result = await this.rolePermissionsRepository.delete({
      roleId,
      permissionId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Permission assignment not found');
    }

    return { message: 'Permission removed from role' };
  }

  // ===== USER ROLES =====

  async assignRoleToUser(
    assignDto: AssignRoleDto,
    organizationId: string,
    grantedBy: string,
  ) {
    await this.getRoleById(assignDto.roleId, organizationId);

    const existing = await this.userRolesRepository.findOne({
      where: {
        userId: assignDto.userId,
        roleId: assignDto.roleId,
      },
    });

    if (existing) {
      throw new ConflictException('Role already assigned to this user');
    }

    const userRole = this.userRolesRepository.create({
      userId: assignDto.userId,
      roleId: assignDto.roleId,
      grantedBy,
    });

    return this.userRolesRepository.save(userRole);
  }

  async removeRoleFromUser(
    userId: string,
    roleId: string,
    organizationId: string,
  ) {
    await this.getRoleById(roleId, organizationId);

    const result = await this.userRolesRepository.delete({
      userId,
      roleId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Role assignment not found');
    }

    return { message: 'Role removed from user' };
  }

  async getUserRoles(userId: string) {
    const userRoles = await this.userRolesRepository.find({
      where: { userId },
      relations: [
        'role',
        'role.rolePermissions',
        'role.rolePermissions.permission',
      ],
    });

    return userRoles.map((ur) => ur.role);
  }

  async getUserPermissions(userId: string) {
    const userRoles = await this.userRolesRepository.find({
      where: { userId },
      relations: [
        'role',
        'role.rolePermissions',
        'role.rolePermissions.permission',
      ],
    });

    const permissionsSet = new Set<string>();
    const permissions = [];

    userRoles.forEach((ur) => {
      ur.role.rolePermissions?.forEach((rp) => {
        const key = `${rp.permission.resource}:${rp.permission.action}`;
        if (!permissionsSet.has(key)) {
          permissionsSet.add(key);
          permissions.push(rp.permission);
        }
      });
    });

    return permissions;
  }
}
