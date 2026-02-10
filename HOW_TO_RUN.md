# 🚀 Hướng Dẫn Chạy Backend + Frontend

## 📦 Cài Đặt Lần Đầu

### Backend
```bash
npm install
```

### Frontend
```bash
npm run frontend:install
# hoặc
cd frontend && npm install
```

## 🎯 Các Lệnh Chạy

### ⭐ Chạy Cả Backend + Frontend (RECOMMENDED)

```bash
npm run dev:all
```

Lệnh này sẽ:
- ✅ Chạy backend trên http://localhost:3000
- ✅ Chạy frontend trên http://localhost:3001
- ✅ Hiển thị logs của cả 2 với màu sắc khác nhau
- ✅ Tự động reload khi code thay đổi

### 🔧 Chạy Riêng Lẻ

#### Backend Only
```bash
npm run start:dev
```

#### Frontend Only
```bash
npm run frontend:dev
# hoặc
cd frontend && npm run dev
```

### 🐚 Dùng Shell Script

```bash
# Cho quyền thực thi (lần đầu)
chmod +x start-dev.sh

# Chạy
./start-dev.sh
```

## 📊 Kết Quả Sau Khi Chạy

```
[BACKEND]  Application is running on port: http://localhost:3000
[FRONTEND] ➜  Local:   http://localhost:3001/
```

### Truy Cập:
- 🌐 **Frontend**: http://localhost:3001
- 🔌 **Backend API**: http://localhost:3000
- 📚 **Swagger Docs**: http://localhost:3000/api

## ⚙️ Setup Database (Lần Đầu)

```bash
# 1. Chạy migrations
npm run migration:run

# 2. Seed dữ liệu mẫu (subscription plans, permissions, etc.)
npm run seed
```

## 🛑 Dừng Server

- **Ctrl + C** trong terminal để dừng
- Nếu chạy bằng `npm run dev:all`, chỉ cần nhấn Ctrl+C một lần

## 🐛 Troubleshooting

### Port đã được sử dụng

**Backend (3000):**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# hoặc thay đổi port trong .env
PORT=3001
```

**Frontend (3001):**
```bash
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# hoặc sửa trong frontend/vite.config.ts
server: { port: 3002 }
```

### Frontend không kết nối backend

Kiểm tra file `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

### TypeScript Errors trong VSCode

VSCode TypeScript server có thể báo lỗi path aliases:
1. Mở Command Palette: `Cmd + Shift + P`
2. Chạy: `TypeScript: Restart TS Server`

Hoặc bỏ qua - Vite vẫn compile thành công!

## 📝 Các Lệnh Khác

```bash
# Build production
npm run build                    # Backend
cd frontend && npm run build     # Frontend

# Chạy production
npm run start:prod              # Backend
cd frontend && npm run preview  # Frontend

# Run tests
npm run test                    # Backend tests
npm run test:e2e               # E2E tests

# Database
npm run migration:generate --name=MigrationName
npm run migration:revert
npm run seed

# Code quality
npm run lint
npm run format
```

## 📋 Checklist Setup Mới

- [ ] Clone repo
- [ ] `npm install` (backend)
- [ ] `npm run frontend:install` (frontend)
- [ ] Tạo file `.env` từ `.env.example`
- [ ] Cấu hình database trong `.env`
- [ ] `npm run migration:run`
- [ ] `npm run seed`
- [ ] `npm run dev:all`
- [ ] Mở http://localhost:3001

## 🎉 Done!

Giờ bạn có thể:
1. Truy cập frontend tại http://localhost:3001
2. Register tài khoản mới
3. Quản lý Users, Roles, Licenses
4. Test API qua Swagger http://localhost:3000/api

---

**Made with ❤️ using NestJS + React + Ant Design**
