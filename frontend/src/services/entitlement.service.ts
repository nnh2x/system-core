import apiClient from './api';
import { FeatureEntitlement, UsageTracking } from '@/types';

export const entitlementService = {
  async getEntitlements(): Promise<FeatureEntitlement[]> {
    const response = await apiClient.get<FeatureEntitlement[]>('/entitlement/features');
    return response.data;
  },

  async checkFeatureAccess(featureCode: string): Promise<{
    hasAccess: boolean;
    limitValue?: number;
    usedValue?: number;
  }> {
    const response = await apiClient.get(`/entitlement/check/${featureCode}`);
    return response.data;
  },

  async recordUsage(featureCode: string, count: number = 1): Promise<void> {
    await apiClient.post('/entitlement/usage', { featureCode, count });
  },

  async getUsageStats(featureCode?: string): Promise<UsageTracking[]> {
    const url = featureCode
      ? `/entitlement/usage/stats?featureCode=${featureCode}`
      : '/entitlement/usage/stats';
    const response = await apiClient.get<UsageTracking[]>(url);
    return response.data;
  },
};
