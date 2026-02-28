import apiClient from './api';
import { User, UserList } from '@/types';

export const userService = {
  async getAll(): Promise<UserList[]> {
    const response = await apiClient.get<UserList[]>('/users');
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(data: Partial<User> & { password: string }): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async assignRole(userId: string, roleId: string): Promise<void> {
    await apiClient.post(`/rbac/users/${userId}/roles/${roleId}`);
  },

  async removeRole(userId: string, roleId: string): Promise<void> {
    await apiClient.delete(`/rbac/users/${userId}/roles/${roleId}`);
  },
};
