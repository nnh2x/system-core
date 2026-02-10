# Entities Structure Review

## ✅ Core Entities (16 total)

### 1. **base.entity.ts** ⭐ Abstract Base
Tất cả entities kế thừa từ class này
- `id`: UUID primary key
- `createdAt`: Timestamp
- `updatedAt`: Timestamp  
- `createdBy`: String (user id)
- `updatedBy`: String (user id)

---

## 🏢 Multi-tenancy & IAM Entities

### 2. **organizations.entity.ts**
Quản lý tenants/organizations
- **Fields**: name, slug, email, phone, logo, website, status, trialEndsAt, settings, metadata
- **Enums**: OrganizationStatus (ACTIVE, SUSPENDED, INACTIVE, TRIAL)
- **Relationships**:
  - `users`: OneToMany → UsersEntity
  - `subscriptions`: OneToMany → SubscriptionsEntity (lazy loaded)
- **Indexes**: slug (unique), status

### 3. **users.entity.ts**
User accounts với organization relationship
- **Fields**: email, password (hashed), firstName, lastName, fullName, code, phone, avatar, dateOfBirth, organizationId, status, emailVerified, lastLoginAt, twoFactorEnabled
- **Enums**: UserStatus (ACTIVE, INACTIVE, SUSPENDED, PENDING)
- **Relationships**:
  - `organization`: ManyToOne → OrganizationsEntity
  - `userRoles`: OneToMany → UserRolesEntity
- **Methods**: 
  - `hashPassword()`: Auto hash password before insert/update
  - `validatePassword()`: Compare password with bcrypt
- **Indexes**: email (unique), code+phone (unique), organizationId

### 4. **roles.entity.ts**
Roles cho RBAC (system & organization level)
- **Fields**: name, displayName, description, type, isDefault, organizationId
- **Enums**: RoleType (SYSTEM, ORGANIZATION)
- **Relationships**:
  - `organization`: ManyToOne → OrganizationsEntity
  - `userRoles`: OneToMany → UserRolesEntity
  - `rolePermissions`: OneToMany → RolePermissionsEntity
- **Indexes**: organizationId+name (unique), type

### 5. **permissions.entity.ts**
Permissions định nghĩa access rights
- **Fields**: resource, action, description, displayName
- **Relationships**:
  - `rolePermissions`: OneToMany → RolePermissionsEntity
- **Indexes**: resource+action (unique)
- **Examples**: users:create, organizations:read, roles:assign

### 6. **user-roles.entity.ts** (Junction Table)
Many-to-many: Users ↔ Roles
- **Fields**: userId, roleId, grantedBy, grantedAt
- **Relationships**:
  - `user`: ManyToOne → UsersEntity
  - `role`: ManyToOne → RolesEntity
- **Indexes**: userId+roleId (unique)

### 7. **role-permissions.entity.ts** (Junction Table)
Many-to-many: Roles ↔ Permissions
- **Fields**: roleId, permissionId
- **Relationships**:
  - `role`: ManyToOne → RolesEntity
  - `permission`: ManyToOne → PermissionsEntity
- **Indexes**: roleId+permissionId (unique)

### 8. **api-keys.entity.ts**
API keys cho external access
- **Fields**: name, keyHash, keyPrefix, userId, organizationId, scopes, expiresAt, lastUsedAt, isActive
- **Relationships**:
  - `user`: ManyToOne → UsersEntity
  - `organization`: ManyToOne → OrganizationsEntity
- **Indexes**: keyHash (unique), organizationId, userId

### 9. **sessions.entity.ts**
User sessions tracking
- **Fields**: token, userId, ipAddress, userAgent, deviceInfo, expiresAt, isRevoked, revokedAt
- **Relationships**:
  - `user`: ManyToOne → UsersEntity
- **Indexes**: token (unique), userId, expiresAt

---

## 💼 License & Subscription Entities

### 10. **subscription-plans.entity.ts**
Subscription plans (Free, Trial, Basic, Pro, Enterprise)
- **Fields**: name, slug, description, type, billingPeriod, price, currency, trialDays, maxUsers, maxProjects, maxStorageGb, isActive, isPublic, metadata
- **Enums**: 
  - PlanType (FREE, TRIAL, BASIC, PROFESSIONAL, ENTERPRISE, CUSTOM)
  - BillingPeriod (MONTHLY, QUARTERLY, YEARLY, LIFETIME)
- **Relationships**:
  - `subscriptions`: OneToMany → SubscriptionsEntity (lazy loaded)
  - `planFeatures`: OneToMany → PlanFeaturesEntity
- **Indexes**: slug (unique), type

### 11. **features.entity.ts**
Features có thể enable/disable
- **Fields**: code, name, description, type, defaultValue, unit, isActive, metadata
- **Enums**: FeatureType (BOOLEAN, LIMIT, QUOTA, FEATURE_FLAG)
- **Relationships**:
  - `planFeatures`: OneToMany → PlanFeaturesEntity
  - `entitlements`: OneToMany → FeatureEntitlementsEntity (lazy loaded)
- **Indexes**: code (unique)
- **Examples**: api_access, advanced_analytics, max_users

### 12. **plan-features.entity.ts** (Junction Table)
Many-to-many: Plans ↔ Features
- **Fields**: planId, featureId, value, isEnabled, metadata
- **Relationships**:
  - `plan`: ManyToOne → SubscriptionPlansEntity
  - `feature`: ManyToOne → FeaturesEntity
- **Indexes**: planId+featureId (unique)

### 13. **subscriptions.entity.ts**
Active subscriptions của organizations
- **Fields**: organizationId, planId, status, startedAt, trialEndsAt, currentPeriodStart, currentPeriodEnd, expiresAt, canceledAt, autoRenew, paymentProvider, externalId, metadata
- **Enums**: SubscriptionStatus (ACTIVE, TRIALING, PAST_DUE, CANCELED, EXPIRED, SUSPENDED)
- **Relationships**:
  - `organization`: ManyToOne → OrganizationsEntity
  - `plan`: ManyToOne → SubscriptionPlansEntity
  - `licenseKeys`: OneToMany → LicenseKeysEntity
- **Indexes**: organizationId, status, expiresAt

### 14. **license-keys.entity.ts**
License keys cho validation
- **Fields**: licenseKey, organizationId, subscriptionId, status, issuedAt, expiresAt, lastValidatedAt, activationCount, maxActivations, metadata
- **Enums**: LicenseKeyStatus (ACTIVE, SUSPENDED, REVOKED, EXPIRED)
- **Relationships**:
  - `organization`: ManyToOne → OrganizationsEntity
  - `subscription`: ManyToOne → SubscriptionsEntity
- **Indexes**: licenseKey (unique), organizationId, status
- **Format**: LIC-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

### 15. **feature-entitlements.entity.ts**
Custom feature grants cho organizations
- **Fields**: organizationId, featureId, value, isEnabled, expiresAt, metadata
- **Relationships**:
  - `organization`: ManyToOne → OrganizationsEntity
  - `feature`: ManyToOne → FeaturesEntity
- **Indexes**: organizationId+featureId (unique)
- **Note**: Overrides plan features

### 16. **usage-tracking.entity.ts**
Theo dõi usage và quotas
- **Fields**: organizationId, featureId, userId, usageCount, periodStart, periodEnd, metadata
- **Relationships**:
  - `organization`: ManyToOne → OrganizationsEntity
  - `feature`: ManyToOne → FeaturesEntity
  - `user`: ManyToOne → UsersEntity
- **Indexes**: organizationId+featureId+periodStart
- **Note**: Track monthly usage

---

## 🔄 Relationship Patterns

### One-to-Many
- Organization → Users
- Organization → Subscriptions (lazy)
- User → UserRoles
- Role → UserRoles, RolePermissions
- Permission → RolePermissions
- Plan → Subscriptions (lazy), PlanFeatures
- Feature → PlanFeatures, Entitlements (lazy)
- Subscription → LicenseKeys

### Many-to-One
- User → Organization
- UserRole → User, Role
- RolePermission → Role, Permission
- Subscription → Organization, Plan
- LicenseKey → Organization, Subscription
- Entitlement → Organization, Feature
- UsageTracking → Organization, Feature, User

### Many-to-Many (via Junction Tables)
- Users ↔ Roles (via user_roles)
- Roles ↔ Permissions (via role_permissions)
- Plans ↔ Features (via plan_features)

---

## 🔧 Technical Notes

### Circular Dependency Resolution
Sử dụng lazy loading (string references) cho:
- `organizations.subscriptions`: OneToMany('SubscriptionsEntity', 'organization')
- `subscription-plans.subscriptions`: OneToMany('SubscriptionsEntity', 'plan')
- `features.entitlements`: OneToMany('FeatureEntitlementsEntity', 'feature')

### Password Security
- `users.entity.ts` tự động hash password với bcrypt (salt rounds: 10)
- Hook `@BeforeInsert()` và `@BeforeUpdate()` 
- Method `validatePassword()` để so sánh password

### Enum Types
Tất cả enums được define trong entity files:
- OrganizationStatus, UserStatus, RoleType
- PlanType, BillingPeriod, FeatureType
- SubscriptionStatus, LicenseKeyStatus

### Indexes Strategy
- **Unique**: email, slug, licenseKey, resource+action, organizationId+name
- **Performance**: status, organizationId, userId, expiresAt
- **Composite**: code+phone, organizationId+featureId+periodStart

### JSON Columns
Sử dụng `jsonb` type cho flexibility:
- organizations.settings, organizations.metadata
- sessions.deviceInfo
- subscriptions.metadata
- api-keys.scopes
- All entities có metadata field

---

## ✅ Validation Status

- [x] All entities extend BaseEntity
- [x] All relationships properly defined
- [x] Circular dependencies resolved with lazy loading
- [x] Indexes optimized for queries
- [x] Enums properly exported
- [x] Password hashing implemented
- [x] TypeScript compilation: ✅ No errors
- [x] Ready for migration generation

---

## 📊 Database Tables Generated (16 tables)

1. organizations
2. system_core_users (users)
3. roles
4. permissions
5. user_roles
6. role_permissions
7. api_keys
8. sessions
9. subscription_plans
10. features
11. plan_features
12. subscriptions
13. license_keys
14. feature_entitlements
15. usage_tracking
16. base table fields (id, created_at, updated_at, created_by, updated_by) in all tables

---

## 🚀 Next Steps

1. ✅ Entities review completed - No compilation errors
2. ⏭️ Generate migration: `npm run migration:generate --name=CreateIAMAndLicenseSystem`
3. ⏭️ Run migration: `npm run migration:run`
4. ⏭️ Seed data: `npm run seed`
