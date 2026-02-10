# IAM & License/Entitlement Service - SaaS Platform

Hệ thống Identity & Access Management (IAM) kết hợp License/Entitlement Service hoàn chỉnh cho mô hình SaaS, được xây dựng trên NestJS và TypeORM.

## 🎯 Tính năng chính

### 1. **Identity & Access Management (IAM)**
- ✅ **Authentication**: JWT-based authentication với refresh tokens
- ✅ **Multi-tenancy**: Hỗ trợ nhiều organizations (tenants) độc lập
- ✅ **RBAC (Role-Based Access Control)**: Quản lý roles và permissions
- ✅ **User Management**: Quản lý users với organization isolation
- ✅ **API Keys**: Generate và quản lý API keys cho integrations
- ✅ **Session Management**: Quản lý sessions và tracking

### 2. **License & Entitlement Service**
- ✅ **Subscription Plans**: Quản lý các gói subscription (Free, Trial, Basic, Pro, Enterprise)
- ✅ **Features Management**: Định nghĩa và quản lý features
- ✅ **License Keys**: Generate và validate license keys
- ✅ **Feature Entitlements**: Kiểm soát quyền truy cập features theo subscription
- ✅ **Usage Tracking**: Theo dõi usage và quotas
- ✅ **Billing Management**: Hỗ trợ monthly, quarterly, yearly billing

## 📊 Database Schema

### Core Entities

#### IAM Entities:
- **organizations**: Quản lý tenants/organizations
- **users**: User accounts với organization relationships
- **roles**: Roles (system & organization level)
- **permissions**: Permissions định nghĩa access rights
- **user_roles**: Many-to-many relationship giữa users và roles
- **role_permissions**: Many-to-many relationship giữa roles và permissions
- **api_keys**: API keys cho external access
- **sessions**: User sessions và tracking

#### License Entities:
- **subscription_plans**: Các gói subscription plans
- **features**: Features có thể được enable/disable
- **plan_features**: Features được bao gồm trong mỗi plan
- **subscriptions**: Active subscriptions của organizations
- **license_keys**: License keys cho validation
- **feature_entitlements**: Custom feature grants cho organizations
- **usage_tracking**: Theo dõi usage và quotas

## 🚀 Cài đặt

### 1. Clone và cài đặt dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Cấu hình Database

Tạo database PostgreSQL:
\`\`\`bash
createdb system_core
\`\`\`

Cấu hình file \`.env\`:
\`\`\`env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=system_core

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

PORT=3000
NODE_ENV=development
\`\`\`

### 3. Chạy Migrations

\`\`\`bash
# Generate migration
npm run migration:generate --name=CreateIAMAndLicenseSystem

# Run migrations
npm run migration:run
\`\`\`

### 4. Khởi chạy ứng dụng

\`\`\`bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
\`\`\`

## 📖 API Documentation

Sau khi khởi động server, truy cập Swagger UI tại:
\`\`\`
http://localhost:3000/api
\`\`\`

### Các Module API chính:

#### 1. Authentication (`/auth`)
- `POST /auth/register` - Đăng ký user và organization mới
- `POST /auth/login` - Đăng nhập
- `GET /auth/profile` - Lấy thông tin profile

#### 2. RBAC (`/rbac`)
**Roles:**
- `POST /rbac/roles` - Tạo role mới
- `GET /rbac/roles` - Lấy danh sách roles
- `PUT /rbac/roles/:id` - Cập nhật role
- `DELETE /rbac/roles/:id` - Xóa role

**Permissions:**
- `POST /rbac/permissions` - Tạo permission
- `GET /rbac/permissions` - Lấy danh sách permissions

**Assignments:**
- `POST /rbac/users/roles/assign` - Gán role cho user
- `POST /rbac/roles/permissions/assign` - Gán permission cho role
- `GET /rbac/users/:userId/roles` - Lấy roles của user
- `GET /rbac/users/:userId/permissions` - Lấy permissions của user

#### 3. Organizations (`/organizations`)
- `POST /organizations` - Tạo organization mới
- `GET /organizations` - Lấy danh sách organizations
- `GET /organizations/current` - Lấy organization hiện tại
- `GET /organizations/:id/members` - Lấy members của organization
- `GET /organizations/:id/stats` - Thống kê organization

#### 4. License Management (`/license`)
**Plans:**
- `POST /license/plans` - Tạo subscription plan
- `GET /license/plans` - Lấy danh sách plans

**Features:**
- `POST /license/features` - Tạo feature
- `GET /license/features` - Lấy danh sách features
- `POST /license/plans/features/assign` - Gán feature cho plan

**Subscriptions:**
- `POST /license/subscriptions` - Tạo subscription
- `GET /license/subscriptions/organization/:orgId` - Lấy subscriptions
- `POST /license/subscriptions/:id/cancel` - Hủy subscription

**License Keys:**
- `POST /license/keys` - Generate license key
- `GET /license/keys/validate/:key` - Validate license key

#### 5. Entitlements (`/entitlements`)
- `GET /entitlements/check/:featureCode` - Kiểm tra quyền truy cập feature
- `POST /entitlements/record-usage/:featureCode` - Ghi nhận usage
- `GET /entitlements/usage/stats` - Thống kê usage
- `POST /entitlements/grant` - Grant custom entitlement
- `DELETE /entitlements/revoke/:orgId/:featureCode` - Thu hồi entitlement

## 🔐 Security & Guards

### 1. JWT Authentication
Tất cả routes mặc định yêu cầu JWT authentication (trừ routes có \`@Public()\`):
\`\`\`typescript
@Public()
@Post('login')
async login() { ... }
\`\`\`

### 2. Role-Based Access Control
Sử dụng \`@Roles()\` decorator để bảo vệ routes:
\`\`\`typescript
@Roles('admin')
@Post('organizations')
async createOrganization() { ... }
\`\`\`

### 3. Permission-Based Access Control
Sử dụng \`@Permissions()\` decorator:
\`\`\`typescript
@Permissions('users:create', 'users:update')
@Post('users')
async createUser() { ... }
\`\`\`

### 4. Feature Access Control
Sử dụng \`@RequireFeature()\` decorator để kiểm tra subscription:
\`\`\`typescript
@RequireFeature('api_access')
@Get('api/data')
async getApiData() { ... }
\`\`\`

## 💡 Ví dụ sử dụng

### 1. Đăng ký Organization mới

\`\`\`bash
curl -X POST http://localhost:3000/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@acme.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "organizationName": "Acme Corporation"
  }'
\`\`\`

### 2. Tạo Subscription Plan

\`\`\`bash
curl -X POST http://localhost:3000/license/plans \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Professional Plan",
    "type": "professional",
    "billingPeriod": "monthly",
    "price": 99.99,
    "trialDays": 14,
    "maxUsers": 50,
    "maxProjects": 100
  }'
\`\`\`

### 3. Tạo Feature

\`\`\`bash
curl -X POST http://localhost:3000/license/features \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "api_access",
    "name": "API Access",
    "description": "Access to REST API",
    "type": "boolean",
    "defaultValue": "true"
  }'
\`\`\`

### 4. Kiểm tra Feature Access

\`\`\`bash
curl -X GET http://localhost:3000/entitlements/check/api_access \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

## 🏗️ Kiến trúc

\`\`\`
src/
├── config/
│   └── typeorm.ts                 # Database configuration
├── decorators/
│   ├── auth.decorator.ts          # @Public, @Roles, @Permissions
│   ├── current-user.decorator.ts  # @CurrentUser
│   └── feature.decorator.ts       # @RequireFeature
├── dtos/
│   ├── auth.dto.ts
│   ├── rbac.dto.ts
│   ├── organization.dto.ts
│   └── license.dto.ts
├── entities/
│   ├── organizations.entity.ts
│   ├── users.entity.ts
│   ├── roles.entity.ts
│   ├── permissions.entity.ts
│   ├── subscription-plans.entity.ts
│   ├── features.entity.ts
│   ├── subscriptions.entity.ts
│   ├── license-keys.entity.ts
│   └── ...
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── permissions.guard.ts
│   └── feature.guard.ts
├── modules/
│   ├── auth/                      # Authentication module
│   ├── rbac/                      # Roles & Permissions
│   ├── organizations/             # Multi-tenancy
│   ├── license/                   # License management
│   └── entitlement/               # Feature access control
├── strategies/
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
└── main.ts
\`\`\`

## 🔄 Workflow điển hình

### Setup mới cho SaaS Platform:

1. **Tạo Subscription Plans**
   - Free tier
   - Trial (14 days)
   - Basic, Professional, Enterprise tiers

2. **Định nghĩa Features**
   - API Access
   - Advanced Analytics
   - Custom Integrations
   - Priority Support
   - Số lượng users, projects, storage

3. **Gán Features cho Plans**
   - Free: Basic features
   - Pro: Advanced features + higher limits
   - Enterprise: All features + unlimited

4. **User Registration**
   - User đăng ký → tạo Organization
   - Tự động assign admin role
   - Tạo trial subscription (14 days)

5. **Feature Access Control**
   - Mỗi request kiểm tra feature entitlement
   - Track usage cho quota-based features
   - Enforce limits theo subscription plan

## 📝 Notes

- **Multi-tenancy**: Mỗi organization hoàn toàn isolated
- **Scalability**: Hỗ trợ horizontal scaling
- **Security**: JWT authentication, RBAC, feature-based access control
- **Flexibility**: Custom entitlements có thể override plan features
- **Usage Tracking**: Theo dõi usage theo tháng/billing period

## 🛠️ Development

\`\`\`bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
\`\`\`

## 📦 Tech Stack

- **NestJS**: Progressive Node.js framework
- **TypeORM**: ORM cho database
- **PostgreSQL**: Relational database
- **Passport**: Authentication middleware
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing
- **Swagger**: API documentation

## 🤝 Contributing

1. Tạo feature branch
2. Implement changes
3. Viết tests
4. Submit pull request

## 📄 License

MIT
