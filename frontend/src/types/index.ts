// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  organizationId: string;
  organization?: Organization;
  roles?: Role[];
  createdAt: string;
  updatedAt: string;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  isActive: boolean;
  subscriptionId?: string;
  subscription?: Subscription;
  createdAt: string;
  updatedAt: string;
}

// Role types
export interface Role {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  permissions?: Permission[];
  createdAt: string;
  updatedAt: string;
}

// Permission types
export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

// Subscription Plan types
export enum PlanType {
  FREE = 'FREE',
  TRIAL = 'TRIAL',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  planType: PlanType;
  description?: string;
  price: number;
  billingCycle: string;
  maxUsers: number;
  maxApiCalls: number;
  isActive: boolean;
  features?: Feature[];
  createdAt: string;
  updatedAt: string;
}

// Feature types
export interface Feature {
  id: string;
  name: string;
  code: string;
  description?: string;
  featureType: 'BOOLEAN' | 'LIMIT' | 'METERED';
  defaultValue?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Subscription types
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED',
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

// License Key types
export enum LicenseKeyStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  SUSPENDED = 'SUSPENDED',
}

export interface LicenseKey {
  id: string;
  subscriptionId: string;
  key: string;
  status: LicenseKeyStatus;
  activatedAt?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Feature Entitlement types
export interface FeatureEntitlement {
  id: string;
  organizationId: string;
  featureId: string;
  feature?: Feature;
  isEnabled: boolean;
  limitValue?: number;
  usedValue?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Usage Tracking types
export interface UsageTracking {
  id: string;
  organizationId: string;
  featureId: string;
  feature?: Feature;
  userId?: string;
  usageCount: number;
  metadata?: Record<string, any>;
  recordedAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
