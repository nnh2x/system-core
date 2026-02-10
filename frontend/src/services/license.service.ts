import apiClient from './api';
import { SubscriptionPlan, Feature, Subscription, LicenseKey } from '@/types';

export const licenseService = {
  // Subscription Plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<SubscriptionPlan[]>('/license/plans');
    return response.data;
  },

  async getPlanById(id: string): Promise<SubscriptionPlan> {
    const response = await apiClient.get<SubscriptionPlan>(`/license/plans/${id}`);
    return response.data;
  },

  async createPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await apiClient.post<SubscriptionPlan>('/license/plans', data);
    return response.data;
  },

  async updatePlan(id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const response = await apiClient.patch<SubscriptionPlan>(`/license/plans/${id}`, data);
    return response.data;
  },

  // Features
  async getFeatures(): Promise<Feature[]> {
    const response = await apiClient.get<Feature[]>('/license/features');
    return response.data;
  },

  async createFeature(data: Partial<Feature>): Promise<Feature> {
    const response = await apiClient.post<Feature>('/license/features', data);
    return response.data;
  },

  async addFeatureToPlan(planId: string, featureId: string, limitValue?: number): Promise<void> {
    await apiClient.post(`/license/plans/${planId}/features/${featureId}`, { limitValue });
  },

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    const response = await apiClient.get<Subscription[]>('/license/subscriptions');
    return response.data;
  },

  async createSubscription(data: {
    organizationId: string;
    planId: string;
    startDate: string;
    endDate?: string;
  }): Promise<Subscription> {
    const response = await apiClient.post<Subscription>('/license/subscriptions', data);
    return response.data;
  },

  async cancelSubscription(id: string): Promise<void> {
    await apiClient.post(`/license/subscriptions/${id}/cancel`);
  },

  // License Keys
  async getLicenseKeys(): Promise<LicenseKey[]> {
    const response = await apiClient.get<LicenseKey[]>('/license/keys');
    return response.data;
  },

  async generateLicenseKey(subscriptionId: string, expiresAt?: string): Promise<LicenseKey> {
    const response = await apiClient.post<LicenseKey>('/license/keys/generate', {
      subscriptionId,
      expiresAt,
    });
    return response.data;
  },

  async validateLicenseKey(key: string): Promise<{ valid: boolean; license?: LicenseKey }> {
    const response = await apiClient.post<{ valid: boolean; license?: LicenseKey }>(
      '/license/keys/validate',
      { key }
    );
    return response.data;
  },

  async revokeLicenseKey(id: string): Promise<void> {
    await apiClient.post(`/license/keys/${id}/revoke`);
  },
};
