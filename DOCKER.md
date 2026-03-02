# Docker Guide

Hướng dẫn build, chạy local và deploy image lên Docker Hub cho project **System Core NestJS**.

---

## Mục lục

1. [Yêu cầu](#yêu-cầu)
2. [Cấu trúc Docker](#cấu-trúc-docker)
3. [Biến môi trường](#biến-môi-trường)
4. [Chạy local với Docker](#chạy-local-với-docker)
5. [Push image lên Docker Hub](#push-image-lên-docker-hub)
6. [Deploy trên server](#deploy-trên-server)
7. [Các lệnh thường dùng](#các-lệnh-thường-dùng)

---

## Yêu cầu

| Tool | Version tối thiểu |
|---|---|
| Docker | 24+ |
| Docker Compose | v2+ (`docker compose`, không phải `docker-compose`) |

---

## Cấu trúc Docker

```
system-core-nestjs/
├── docker-compose.yml          # Orchestrate toàn bộ services
├── deploy.sh                   # Script build + push image lên Hub
├── backend/
│   ├── Dockerfile              # Multi-stage: development / production
│   └── .dockerignore
└── frontend/
    ├── Dockerfile              # Multi-stage: development / production
    ├── nginx.conf              # Nginx config cho production (SPA + proxy API)
    └── .dockerignore
```

### Các stage trong Dockerfile

| Service | Stage `development` | Stage `production` |
|---|---|---|
| Backend | `nest start --watch` (hot-reload) | `node dist/main` (compiled) |
| Frontend | Vite dev server (port 3001) | Nginx serve static + proxy `/api` |

---

## Biến môi trường

Project dùng **Neon PostgreSQL** (cloud), không cần database local.

| Biến | Giá trị |
|---|---|
| `DATABASE_HOST` | `ep-shiny-field-a1ie6idp-pooler.ap-southeast-1.aws.neon.tech` |
| `DATABASE_PORT` | `5432` |
| `DATABASE_USER` | `neondb_owner` |
| `DATABASE_PASSWORD` | `npg_Af2IjeR5EvLu` |
| `DATABASE_NAME` | `neondb` |
| `JWT_SECRET` | `your-super-secret-jwt-key-...` |
| `PORT` | `3000` |
| `NODE_ENV` | `development` |

> Các biến này đã được khai báo sẵn trong `docker-compose.yml`. Khi chạy local không cần file `.env` riêng.

---

## Chạy local với Docker

### Lần đầu (build image)

```bash
# Từ thư mục gốc
cd system-core-nestjs

docker compose up --build
```

### Các lần sau (không cần rebuild)

```bash
docker compose up
```

### Chạy background (không chiếm terminal)

```bash
docker compose up -d
```

### Dừng

```bash
docker compose down
```

### Kiểm tra trạng thái

```bash
docker compose ps
```

### Xem log realtime

```bash
# Tất cả services
docker compose logs -f

# Chỉ backend
docker compose logs -f backend

# Chỉ frontend
docker compose logs -f frontend
```

---

### Sau khi chạy thành công

| Service | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000 |
| Swagger UI | http://localhost:3000/api |

---

## Push image lên Docker Hub

### Đăng nhập (chỉ cần làm 1 lần)

```bash
docker login
# Nhập username: huy9983123203
# Nhập password
```

### Push nhanh với `deploy.sh`

```bash
# Push tag latest
./deploy.sh

# Push tag theo version (sẽ tự động tag latest luôn)
./deploy.sh v1.0.0
./deploy.sh v1.2.3
```

Script sẽ:
1. Build image backend và frontend
2. Tag theo version được truyền vào
3. Tag thêm `latest`
4. Push tất cả lên Docker Hub

### Images trên Docker Hub

| Image | URL |
|---|---|
| Backend | https://hub.docker.com/r/huy9983123203/system-core-backend |
| Frontend | https://hub.docker.com/r/huy9983123203/system-core-frontend |

---

## Deploy trên server

Pull image mới nhất về và khởi động lại:

```bash
docker compose pull
docker compose up -d
```

Hoặc pull image cụ thể:

```bash
docker pull huy9983123203/system-core-backend:v1.0.0
docker pull huy9983123203/system-core-frontend:v1.0.0
```

---

## Các lệnh thường dùng

| Lệnh | Mô tả |
|---|---|
| `docker compose up --build` | Build lại và chạy |
| `docker compose up -d` | Chạy background |
| `docker compose down` | Dừng và xóa containers |
| `docker compose down -v` | Dừng và xóa cả volumes |
| `docker compose logs -f` | Xem log realtime |
| `docker compose ps` | Xem trạng thái containers |
| `docker compose restart backend` | Restart riêng backend |
| `./deploy.sh` | Build + push latest lên Docker Hub |
| `./deploy.sh v1.0.0` | Build + push version cụ thể |

---

## Workflow khi thay đổi code

```
1. Sửa code
       ↓
2. docker compose up --build    (test local)
       ↓
3. ./deploy.sh v<version>       (push lên Docker Hub)
       ↓
4. (trên server) docker compose pull && docker compose up -d
```


// trigger code