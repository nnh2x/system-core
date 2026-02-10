# IAM & License Management System - Frontend

React Admin Panel for Identity & Access Management and License/Entitlement System.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Ant Design 5** - Enterprise UI components
- **React Router 7** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## 📦 Features

### ✅ Implemented Pages

1. **Authentication**
   - Login with email/password
   - Register new organization with admin user
   - JWT token management with auto-refresh
   - Protected routes

2. **Dashboard**
   - Overview statistics (Users, Roles, Subscriptions, Entitlements)
   - Quick actions and navigation

3. **Users Management**
   - CRUD operations with Ant Design Drawer
   - User activation/deactivation
   - Role assignment
   - Table with pagination

4. **Roles & Permissions**
   - Role CRUD operations
   - Permission management
   - Assign/remove permissions to roles with Transfer component
   - Create custom permissions (resource:action)

5. **License Plans**
   - Subscription plan management
   - Plan types: FREE, TRIAL, BASIC, PRO, ENTERPRISE
   - Configure max users, API calls, pricing
   - Feature assignment to plans

### 🔧 Planned Pages (Placeholders Ready)

- Organizations Management
- Subscriptions Management
- License Keys Management
- Entitlements & Usage Tracking

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── MainLayout.tsx   # Main app layout with sidebar
│   ├── pages/               # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── RolesPage.tsx
│   │   └── LicensePlansPage.tsx
│   ├── services/            # API services
│   │   ├── api.ts           # Axios config with interceptors
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── rbac.service.ts
│   │   ├── license.service.ts
│   │   └── entitlement.service.ts
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   ├── types/               # TypeScript types
│   │   └── index.ts         # All interfaces & enums
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎯 Installation

```bash
cd frontend
npm install
```

## 🔑 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Access the app at: **http://localhost:3001**

## 🎨 UI Components (Ant Design)

### Key Components Used:

- **Drawer** - For create/edit forms (sliding panel from right)
- **Table** - Data display with pagination, sorting
- **Form** - Form handling with validation
- **Transfer** - For permission assignment (dual list)
- **Tabs** - Organize related content
- **Tag** - Status and category display
- **Modal** - Confirmations (via Popconfirm)
- **Layout** - App structure (Sider, Header, Content)
- **Menu** - Navigation sidebar

### Example: User Management with Drawer

```tsx
<Drawer
  title="Create User"
  width={480}
  open={drawerVisible}
  onClose={() => setDrawerVisible(false)}
>
  <Form onFinish={handleSubmit}>
    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    {/* More form fields */}
  </Form>
</Drawer>
```

## 🔐 Authentication Flow

1. User logs in → JWT tokens stored in localStorage
2. Axios interceptor adds Bearer token to all requests
3. On 401 error → Auto-refresh token
4. If refresh fails → Redirect to login
5. AuthContext provides user state globally

## 📡 API Integration

All services use the configured `apiClient` with:
- Auto token injection
- Auto token refresh on 401
- Error handling
- TypeScript types

Example:
```typescript
// services/user.service.ts
export const userService = {
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  }
}
```

## 🎯 Next Steps

To complete the admin panel:

1. **Create remaining pages:**
   - Organizations Management
   - Subscriptions Management
   - License Keys with QR code
   - Entitlements with usage charts

2. **Add features:**
   - Charts and analytics (recharts/chart.js)
   - Export to CSV/Excel
   - Advanced filters
   - Bulk operations
   - Real-time notifications

3. **Enhance UX:**
   - Loading skeletons
   - Error boundaries
   - Toast notifications
   - Keyboard shortcuts

## 📝 Notes

- Vite proxy configured: `/api` → `http://localhost:3000`
- Backend must be running on port 3000
- Enable CORS in NestJS backend
- TypeScript strict mode enabled
- All components use TypeScript with proper typing

## 🤝 Backend Integration

Ensure your NestJS backend has CORS enabled:

```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true,
});
```

## 📚 Learn More

- [Ant Design Components](https://ant.design/components/overview)
- [Ant Design Drawer](https://ant.design/components/drawer)
- [React Router](https://reactrouter.com/)
- [Vite Guide](https://vitejs.dev/guide/)
