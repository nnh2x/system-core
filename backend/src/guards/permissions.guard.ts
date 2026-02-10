import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, ROLES_KEY } from '../decorators/auth.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRolesEntity } from '../entities/user-roles.entity';
import { RolePermissionsEntity } from '../entities/role-permissions.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserRolesEntity)
    private userRolesRepository: Repository<UserRolesEntity>,
    @InjectRepository(RolePermissionsEntity)
    private rolePermissionsRepository: Repository<RolePermissionsEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions && !requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Get user's roles
    const userRoles = await this.userRolesRepository.find({
      where: { userId: user.id },
      relations: ['role'],
    });

    const userRoleNames = userRoles.map((ur) => ur.role.name);

    // Check roles if required
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some((role) =>
        userRoleNames.includes(role),
      );
      if (!hasRole) {
        return false;
      }
    }

    // Check permissions if required
    if (requiredPermissions && requiredPermissions.length > 0) {
      const roleIds = userRoles.map((ur) => ur.roleId);

      const rolePermissions = await this.rolePermissionsRepository.find({
        where: roleIds.map((roleId) => ({ roleId })),
        relations: ['permission'],
      });

      const userPermissions = rolePermissions.map(
        (rp) => `${rp.permission.resource}:${rp.permission.action}`,
      );

      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasPermission) {
        return false;
      }
    }

    return true;
  }
}
