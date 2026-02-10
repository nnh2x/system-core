# 🚀 Quick Start Guide - React Frontend

## ✅ Server đã chạy thành công!

Frontend Vite dev server đang chạy trên: **http://localhost:3001**

## 📝 Note về TypeScript Errors

Bạn đang thấy TypeScript errors trong VSCode vì VSCode TypeScript server chưa nhận diện đúng path aliases (`@/*`).

**Giải pháp:**

### Option 1: Restart VSCode TypeScript Server
1. Mở Command Palette: `Cmd + Shift + P`
2. Gõ: `TypeScript: Restart TS Server`
3. Enter

### Option 2: Reload VSCode Window  
1. Command Palette: `Cmd + Shift + P`
2. Gõ: `Developer: Reload Window`
3. Enter

### Option 3: Bỏ qua (Recommended để test nhanh)
- Vite đang compile thành công (không có lỗi thật sự)
- Chỉ là VSCode TypeScript check
- App vẫn chạy bình thường tại http://localhost:3001

## 🎯 Test Frontend

1. Mở browser: http://localhost:3001
2. Bạn sẽ thấy Login/Register page
3. Thử register account mới
4. Backend phải chạy trên port 3000

## 🔧 Start Backend (nếu chưa chạy)

```bash
# Terminal mới
cd /Users/huy.ngo/Documents/system-core-nestjs
npm run start:dev
```

## ✅ Kiểm tra

- Frontend: http://localhost:3001 (React UI)
- Backend: http://localhost:3000 (NestJS API)
- Swagger: http://localhost:3000/api (API Docs)

## 📱 Pages Available

- `/login` - Login & Register
- `/dashboard` - Overview statistics  
- `/users` - Users CRUD với Drawer
- `/roles` - Roles & Permissions
- `/licenses/plans` - Subscription Plans

## 🐛 Nếu vẫn thấy lỗi TypeScript

Chạy TypeScript check manually:

```bash
cd frontend
npm run type-check
```

Nếu có lỗi path alias, thử:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## ✨ Frontend đã sẵn sàng!

Vite server đang chạy, truy cập http://localhost:3001 để xem UI!
