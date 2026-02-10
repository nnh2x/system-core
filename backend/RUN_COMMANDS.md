## 🚀 LỆNH CHẠY NHANH

### ⭐ Chạy Cả 2 (Backend + Frontend)
```bash
npm run dev:all
```

### 🔷 Backend Only
```bash
npm run start:dev
```
Mở: http://localhost:3000
Swagger: http://localhost:3000/api

### 🟣 Frontend Only  
```bash
npm run frontend:dev
```
Mở: http://localhost:3001

---

### 📦 Setup Lần Đầu
```bash
# 1. Cài dependencies
npm install
npm run frontend:install

# 2. Setup database
npm run migration:run
npm run seed

# 3. Chạy
npm run dev:all
```

### 🌐 Truy Cập
- Frontend UI: http://localhost:3001
- Backend API: http://localhost:3000  
- API Docs: http://localhost:3000/api

---

Chi tiết: Xem [HOW_TO_RUN.md](HOW_TO_RUN.md)
