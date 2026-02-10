# Quick Start Guide - IAM & License System

## 📋 Prerequisites

- Node.js >= 18
- PostgreSQL >= 13
- npm or yarn

## 🚀 Quick Setup (5 phút)

### 1. Cài đặt dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Setup Database
\`\`\`bash
# Tạo database
createdb system_core

# Hoặc với psql
psql -U postgres
CREATE DATABASE system_core;
\q
\`\`\`

### 3. Cấu hình môi trường
\`\`\`bash
# Copy file .env
cp .env.example .env

# Sửa file .env với thông tin database của bạn
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USER=postgres
# DATABASE_PASSWORD=your_password
# DATABASE_NAME=system_core
\`\`\`

### 4. Chạy Migration & Seed
\`\`\`bash
# Generate và chạy migrations
npm run migration:generate --name=InitialSetup
npm run migration:run

# Seed dữ liệu mẫu (plans, features, permissions)
npm run seed
\`\`\`

### 5. Khởi động Server
\`\`\`bash
npm run start:dev
\`\`\`

Server sẽ chạy tại: http://localhost:3000
Swagger API docs: http://localhost:3000/api

## 🎯 Test thử nghiệm

### 1. Đăng ký Organization đầu tiên

\`\`\`bash
curl -X POST http://localhost:3000/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!@#",
    "firstName": "Admin",
    "lastName": "User",
    "organizationName": "Test Company"
  }'
\`\`\`

Response:
\`\`\`json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@test.com",
    "fullName": "Admin User",
    "organizationId": "uuid"
  }
}
\`\`\`

### 2. Đăng nhập

\`\`\`bash
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!@#"
  }'
\`\`\`

### 3. Lấy profile

\`\`\`bash
curl -X GET http://localhost:3000/auth/profile \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
\`\`\`

### 4. Xem subscription plans

\`\`\`bash
curl -X GET http://localhost:3000/license/plans
\`\`\`

### 5. Kiểm tra feature access

\`\`\`bash
curl -X GET http://localhost:3000/entitlements/check/api_access \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
\`\`\`

Response:
\`\`\`json
{
  "hasAccess": true,
  "value": "true"
}
\`\`\`

### 6. Xem usage stats

\`\`\`bash
curl -X GET http://localhost:3000/entitlements/usage/stats \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
\`\`\`

## 📊 Dữ liệu mẫu sau khi seed

### Subscription Plans:
- **Free**: $0/month - 3 users, 5 projects
- **Trial**: $0 - 14 days trial - 10 users, 20 projects
- **Basic**: $29/month - 10 users, 25 projects
- **Professional**: $99/month - 50 users, 100 projects
- **Enterprise**: $499/month - Unlimited

### Features:
- `api_access`: API Access
- `advanced_analytics`: Advanced Analytics
- `custom_integrations`: Custom Integrations
- `priority_support`: Priority Support
- `sso`: Single Sign-On
- `audit_logs`: Audit Logs
- `max_users`: Max Users (limit)
- `max_projects`: Max Projects (limit)
- `api_requests`: API Requests (quota)

### Permissions:
- users:create, users:read, users:update, users:delete
- organizations:create, organizations:read, organizations:update, organizations:delete
- roles:create, roles:read, roles:update, roles:delete, roles:assign
- licenses:create, licenses:read, licenses:revoke
- subscriptions:create, subscriptions:read, subscriptions:update, subscriptions:cancel

## 🔐 Testing với Postman/Insomnia

Import collection từ Swagger UI:
1. Mở http://localhost:3000/api
2. Click "Download" để lấy OpenAPI spec
3. Import vào Postman/Insomnia

Hoặc xem examples trong: `/src/modules/examples/example.controller.ts`

## 🎓 Examples trong Code

File `/src/modules/examples/example.controller.ts` chứa nhiều ví dụ về:
- Public endpoints
- JWT authentication
- Role-based protection
- Permission-based protection
- Feature-based protection (subscription)
- Quota usage tracking
- Multiple guards combination

## 📖 Next Steps

Đọc file `IAM_LICENSE_README.md` để hiểu chi tiết về:
- Architecture
- Database schema
- API endpoints
- Security guards
- Best practices

## 💡 Troubleshooting

### Database connection error
- Kiểm tra PostgreSQL đã chạy: `pg_isready`
- Kiểm tra credentials trong file `.env`
- Kiểm tra database đã tạo: `psql -l`

### Migration error
- Xóa migrations cũ trong `src/migrations/`
- Generate lại: `npm run migration:generate --name=Fresh`
- Run lại: `npm run migration:run`

### Port 3000 đã được sử dụng
- Đổi PORT trong file `.env`
- Hoặc kill process: `lsof -ti:3000 | xargs kill`
