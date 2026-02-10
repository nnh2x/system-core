# 🚀 IAM & License Management System - Full Stack Guide

Complete Identity & Access Management + License/Entitlement Service với NestJS Backend + React Frontend.

## 📋 Tổng Quan Hệ Thống

### Backend (NestJS)
- **Port**: 3000
- **Swagger API**: http://localhost:3000/api
- **Database**: PostgreSQL (Neon Cloud)
- **Authentication**: JWT with Passport
- **ORM**: TypeORM

### Frontend (React)
- **Port**: 3001
- **UI Framework**: Ant Design 5
- **Build Tool**: Vite
- **State**: Context API
- **Routing**: React Router 7

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│  Port 3001 - Ant Design UI - TypeScript                   │
│  ├── Login/Register                                        │
│  ├── Dashboard                                             │
│  ├── Users Management (with Drawer)                       │
│  ├── Roles & Permissions (with Transfer)                  │
│  ├── License Plans                                         │
│  └── Entitlements                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                   Backend (NestJS)                          │
│  Port 3000 - TypeORM - JWT Auth                           │
│  ├── Auth Module (Login, Register, JWT)                   │
│  ├── RBAC Module (Roles, Permissions)                     │
│  ├── Organizations Module (Multi-tenancy)                 │
│  ├── License Module (Plans, Subscriptions, Keys)          │
│  └── Entitlement Module (Features, Usage Tracking)        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Neon Cloud)              │
│  16 Tables: Users, Roles, Permissions, Organizations,     │
│  Subscriptions, Features, Licenses, etc.                   │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Tính Năng Chính

### 1. Identity & Access Management (IAM)
- ✅ User registration & authentication
- ✅ Organization-based multi-tenancy
- ✅ Role-Based Access Control (RBAC)
- ✅ Permission management (resource:action)
- ✅ JWT token with auto-refresh
- ✅ Session management
- ✅ API key authentication

### 2. License Management
- ✅ 5 Subscription plans (FREE, TRIAL, BASIC, PRO, ENTERPRISE)
- ✅ Feature management
- ✅ Plan-feature associations
- ✅ Subscription lifecycle (Active, Trial, Expired, Cancelled)
- ✅ License key generation & validation
- ✅ Auto-renewal support

### 3. Entitlement Service
- ✅ Feature access control
- ✅ Usage tracking & quota management
- ✅ 3 Feature types: Boolean, Limit, Metered
- ✅ Real-time usage monitoring
- ✅ Organization-level entitlements

## 🚀 Quick Start

### Cách 1: Chạy Tất Cả (Recommended)

```bash
# Clone và cài đặt
git clone <repo>
cd system-core-nestjs

# Chạy script tự động (backend + frontend)
./start-dev.sh
```

### Cách 2: Chạy Riêng Lẻ

#### Backend
```bash
# Install dependencies
npm install

# Setup database
npm run migration:run

# Seed initial data
npm run seed

# Start backend
npm run start:dev
```

#### Frontend
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

## 📦 Database Setup

### 1. Tạo và chạy migrations

```bash
# Generate migration từ entities
npm run migration:generate --name=InitialSetup

# Run migrations
npm run migration:run

# Revert migration (nếu cần)
npm run migration:revert
```

### 2. Seed dữ liệu mẫu

```bash
npm run seed
```

Seed data bao gồm:
- 5 Subscription Plans (Free → Enterprise)
- 10+ Features (API Access, Users Limit, Storage, etc.)
- Permissions cơ bản
- Sample admin role

## 🎨 Frontend Features

### Đã Triển Khai (Ant Design Drawer)

#### 1. **Login & Register Page**
- Tabs chuyển đổi Login/Register
- Form validation
- Auto-login sau register
- JWT token storage

#### 2. **Dashboard**
- Statistics cards (Users, Roles, Subscriptions, Entitlements)
- Quick actions menu
- User profile display

#### 3. **Users Management**
- Table với pagination
- **Drawer** cho Create/Edit user
- Switch toggle cho active status
- Delete với confirmation
- Role assignment

#### 4. **Roles & Permissions**
- Tabs: Roles | Permissions
- **Drawer** cho Create/Edit role
- **Transfer component** cho permission assignment
- Inline form tạo permission mới
- Resource:Action permission model

#### 5. **License Plans**
- Table hiển thị plans
- **Drawer** cho Create/Edit plan
- Plan type tags (colored)
- Price formatting
- Max users/API calls configuration

### Coming Soon
- Organizations page
- Subscriptions management
- License keys với QR code
- Entitlements với usage charts
- Real-time notifications

## 🔑 API Endpoints

### Auth
```
POST   /auth/register      - Register new organization + admin
POST   /auth/login         - Login và nhận JWT
GET    /auth/profile       - Get current user profile
```

### Users
```
GET    /users              - List all users
POST   /users              - Create user
GET    /users/:id          - Get user detail
PATCH  /users/:id          - Update user
DELETE /users/:id          - Delete user
```

### RBAC
```
GET    /rbac/roles                          - List roles
POST   /rbac/roles                          - Create role
GET    /rbac/permissions                    - List permissions
POST   /rbac/roles/:roleId/permissions/:permId  - Assign permission
DELETE /rbac/roles/:roleId/permissions/:permId  - Remove permission
```

### License
```
GET    /license/plans                       - List plans
POST   /license/plans                       - Create plan
POST   /license/plans/:planId/features/:featureId  - Add feature to plan
GET    /license/subscriptions               - List subscriptions
POST   /license/subscriptions               - Create subscription
POST   /license/keys/generate               - Generate license key
POST   /license/keys/validate               - Validate key
```

### Entitlement
```
GET    /entitlement/features                - List entitlements
GET    /entitlement/check/:featureCode      - Check feature access
POST   /entitlement/usage                   - Record usage
GET    /entitlement/usage/stats             - Get usage stats
```

## 🔐 Authentication Flow

1. **Register**: `POST /auth/register`
   - Tạo Organization mới
   - Tạo Admin user
   - Assign Admin role
   - Return JWT tokens

2. **Login**: `POST /auth/login`
   - Validate credentials
   - Return access_token + refresh_token

3. **Protected Routes**:
   - Frontend: PrivateRoute component
   - Backend: JwtAuthGuard
   - Auto token refresh khi 401

## 📊 Database Schema

### Core Entities (16 tables)

1. **organizations** - Multi-tenant organizations
2. **users** - User accounts
3. **roles** - Role definitions
4. **permissions** - Permission definitions
5. **user_roles** - User-Role mappings
6. **role_permissions** - Role-Permission mappings
7. **sessions** - Active user sessions
8. **api_keys** - API authentication keys
9. **subscription_plans** - Plan definitions
10. **features** - Feature catalog
11. **plan_features** - Plan-Feature mappings
12. **subscriptions** - Organization subscriptions
13. **license_keys** - Generated license keys
14. **feature_entitlements** - Organization feature access
15. **usage_tracking** - Feature usage logs

## 🎨 UI Components (Ant Design)

### Key Components Được Sử Dụng

- **Drawer** ⭐ - Sliding panel cho forms (chính)
- **Table** - Data grid với pagination
- **Transfer** - Dual-list cho permission assignment
- **Form** - Form handling với validation
- **Tabs** - Organize content
- **Tag** - Status display
- **Popconfirm** - Delete confirmations
- **Layout** - Sidebar + Header + Content
- **Menu** - Navigation

### Example: Drawer Usage

```tsx
<Drawer
  title="Create User"
  width={480}
  open={drawerVisible}
  onClose={() => setDrawerVisible(false)}
  footer={
    <Space>
      <Button onClick={onCancel}>Cancel</Button>
      <Button type="primary" onClick={onSubmit}>Submit</Button>
    </Space>
  }
>
  <Form layout="vertical">
    {/* Form fields */}
  </Form>
</Drawer>
```

## 🛠️ Development Commands

### Backend
```bash
npm run start:dev        # Start with watch mode
npm run build            # Build production
npm run migration:generate --name=Name  # Generate migration
npm run migration:run    # Run migrations
npm run seed             # Seed database
```

### Frontend
```bash
cd frontend
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_HOST=ep-shiny-field-a1ie6idp-pooler.ap-southeast-1.aws.neon.tech
DATABASE_PORT=5432
DATABASE_USER=neondb_owner
DATABASE_PASSWORD=npg_Af2IjeR5EvLu
DATABASE_NAME=neondb
DATABASE_SSL=true

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRATION=7d
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🔍 Testing

### Default Login
Sau khi seed hoặc register:
- Email: admin@example.com (or your registered email)
- Password: (password bạn đã set)

### API Testing
- Swagger UI: http://localhost:3000/api
- Click "Authorize" và nhập Bearer token

## 🚧 Next Steps

### Backend Enhancements
- [ ] Add rate limiting
- [ ] Implement webhooks
- [ ] Add email notifications
- [ ] Two-factor authentication
- [ ] Audit logging
- [ ] API versioning

### Frontend Enhancements
- [ ] Organizations CRUD page
- [ ] Subscriptions management
- [ ] License keys page with QR
- [ ] Entitlements with charts
- [ ] Usage analytics dashboard
- [ ] Export to CSV/Excel
- [ ] Dark mode
- [ ] Mobile responsive

## 📚 Documentation

- Backend: [IAM_LICENSE_README.md](IAM_LICENSE_README.md)
- Frontend: [frontend/README.md](frontend/README.md)
- Quickstart: [QUICKSTART.md](QUICKSTART.md)
- Entities: [ENTITIES_REVIEW.md](ENTITIES_REVIEW.md)

## 🤝 Contributing

1. Tạo feature branch
2. Implement changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License

---

**Made with ❤️ using NestJS, React, Ant Design, and TypeORM**
