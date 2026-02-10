import apiClient from './api';
import { Role, Permission } from '@/types';

export const rbacService = {
  // Roles
  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get<Role[]>('/rbac/roles');
    return response.data;
  },

  async getRoleById(id: string): Promise<Role> {
    const response = await apiClient.get<Role>(`/rbac/roles/${id}`);
    return response.data;
  },

  async createRole(data: { name: string; description?: string }): Promise<Role> {
    const response = await apiClient.post<Role>('/rbac/roles', data);
    return response.data;
  },

  async updateRole(id: string, data: Partial<Role>): Promise<Role> {
    const response = await apiClient.patch<Role>(`/rbac/roles/${id}`, data);
    return response.data;
  },

  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(`/rbac/roles/${id}`);
  },

  // Permissions
  async getPermissions(): Promise<Permission[]> {
    const response = await apiClient.get<Permission[]>('/rbac/permissions');
    return response.data;
  },

  async createPermission(data: {
    name: string;
    description?: string;
    resource: string;
    action: string;
  }): Promise<Permission> {
    const response = await apiClient.post<Permission>('/rbac/permissions', data);
    return response.data;
  },

  async assignPermission(roleId: string, permissionId: string): Promise<void> {
    await apiClient.post(`/rbac/roles/${roleId}/permissions/${permissionId}`);
  },

  async removePermission(roleId: string, permissionId: string): Promise<void> {
    await apiClient.delete(`/rbac/roles/${roleId}/permissions/${permissionId}`);
  },
};
