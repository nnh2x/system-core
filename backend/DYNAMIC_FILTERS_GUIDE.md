# 🔧 Advanced Filters & Dynamic Search

Hướng dẫn sử dụng tính năng **Filters Động** (Dynamic Filters) cho pagination API.

## 🎯 Các Loại Search/Filter

Hệ thống hỗ trợ **4 cách** lọc/tìm kiếm dữ liệu:

| Loại | Parameters | Mô tả | Ưu tiên |
|------|------------|-------|---------|
| **1. Dynamic Filters** | `filters` | Lọc chính xác nhiều trường | ⭐ Cao nhất |
| **2. Field-Specific Search** | `searchField` + `searchValue` | Tìm kiếm 1 trường cụ thể | ⭐⭐ Cao |
| **3. Multi-Field Search** | `search` | Tìm kiếm trên nhiều trường | ⭐⭐⭐ Trung bình |
| **4. Base Filters** | Trong code | Filters cố định (VD: organizationId) | Luôn áp dụng |

---

## 1️⃣ Dynamic Filters (Mới) ⭐

Lọc chính xác theo nhiều trường với **JSON object**.

### Cú pháp:
```bash
GET /users/paginated?filters={"field1":"value1","field2":"value2"}
```

### Đặc điểm:
- ✅ Tìm kiếm **CHÍNH XÁC** (exact match)
- ✅ Hỗ trợ **NHIỀU trường** cùng lúc
- ✅ Kết hợp được với search/pagination/sort

### Ví dụ:

#### Filter theo 1 trường
```bash
# Lọc users có status = "active"
GET /users/paginated?filters={"status":"active"}
```

#### Filter theo nhiều trường
```bash
# Lọc users có status = "active" VÀ role = "admin"
GET /users/paginated?filters={"status":"active","role":"admin"}
```

#### Filter với email cụ thể
```bash
# Lọc user có email chính xác
GET /users/paginated?filters={"email":"john@gmail.com"}
```

#### Kết hợp Filter + Search
```bash
# Lọc users active VÀ tìm kiếm có chứa "john"
GET /users/paginated?filters={"status":"active"}&search=john
```

#### Kết hợp tất cả
```bash
# Filter status, search "john", page 2, sort by email
GET /users/paginated?filters={"status":"active"}&search=john&page=2&limit=20&sortBy=email&sortOrder=ASC
```

---

## 2️⃣ Field-Specific Search

Tìm kiếm **PARTIAL MATCH** trên 1 trường.

```bash
# Tìm users có email CHỨA "gmail.com"
GET /users/paginated?searchField=email&searchValue=gmail.com
```

**So sánh với Filters:**
- `filters={"email":"john@gmail.com"}` → Chỉ tìm email chính xác là "john@gmail.com"
- `searchField=email&searchValue=gmail` → Tìm tất cả email CHỨA "gmail"

---

## 3️⃣ Multi-Field Search

Tìm kiếm **PARTIAL MATCH** trên nhiều trường.

```bash
# Tìm "john" trong email, firstName, lastName, fullName
GET /users/paginated?search=john
```

---

## 🔄 Thứ Tự Ưu Tiên

Khi kết hợp nhiều loại filter:

```
1. Filters động (filters) - Luôn được áp dụng
2. searchField + searchValue - Override search
3. search - Nếu không có searchField
4. Base where - Luôn được áp dụng (VD: organizationId)
```

### Ví dụ Ưu Tiên:

```bash
# Trường hợp 1: Có cả filters và search
GET /users/paginated?filters={"status":"active"}&search=john

# Kết quả: 
# - Filter: status = "active" (exact)
# - Search: email/firstName/lastName LIKE "%john%" (partial)
# - Kết hợp: status="active" AND (email LIKE "%john%" OR firstName LIKE "%john%"...)
```

```bash
# Trường hợp 2: Có cả filters và searchField
GET /users/paginated?filters={"status":"active"}&searchField=email&searchValue=gmail

# Kết quả:
# - Filter: status = "active" (exact)
# - Search: email LIKE "%gmail%" (partial)
# - Kết hợp: status="active" AND email LIKE "%gmail%"
```

---

## 📝 Ví Dụ Thực Tế

### Use Case 1: Admin Dashboard - Filter Users

```bash
# Lọc users active, có role admin, sort theo ngày tạo
GET /users/paginated?filters={"status":"active","role":"admin"}&sortBy=createdAt&sortOrder=DESC
```

### Use Case 2: Search trong một nhóm cụ thể

```bash
# Tìm users active có tên chứa "nguyen"
GET /users/paginated?filters={"status":"active"}&search=nguyen
```

### Use Case 3: Filter + Pagination

```bash
# Lấy trang 3 của users active, 50 items/page
GET /users/paginated?filters={"status":"active"}&page=3&limit=50
```

### Use Case 4: Complex Filter

```bash
# Filter theo nhiều điều kiện
GET /users/paginated?filters={"status":"active","department":"IT","role":"developer"}
```

---

## 🔐 cURL Examples

### Với JSON Filters (URL Encoded)

```bash
# Filters simple
curl -X GET "http://localhost:3000/users/paginated?filters=%7B%22status%22%3A%22active%22%7D" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filters với nhiều trường
curl -X GET "http://localhost:3000/users/paginated?filters=%7B%22status%22%3A%22active%22%2C%22role%22%3A%22admin%22%7D" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Kết hợp filters + search
curl -X GET "http://localhost:3000/users/paginated?filters=%7B%22status%22%3A%22active%22%7D&search=john" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript/TypeScript

```typescript
// Tạo filters object
const filters = {
  status: 'active',
  role: 'admin'
};

// Convert sang JSON string và encode
const filtersParam = encodeURIComponent(JSON.stringify(filters));

// Gọi API
const response = await fetch(
  `http://localhost:3000/users/paginated?filters=${filtersParam}&page=1&limit=10`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const data = await response.json();
```

### React/Vue Example

```typescript
// Hook để fetch với filters
const fetchUsers = async (filters: Record<string, any>, page: number = 1) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '10',
  });
  
  if (Object.keys(filters).length > 0) {
    params.append('filters', JSON.stringify(filters));
  }
  
  const response = await fetch(`/api/users/paginated?${params}`);
  return response.json();
};

// Sử dụng
await fetchUsers({ status: 'active', role: 'admin' }, 1);
```

---

## ⚠️ Lưu Ý

### 1. JSON Format

Filters phải là **valid JSON string**:

✅ **Đúng:**
```bash
?filters={"status":"active"}
?filters={"status":"active","role":"admin"}
```

❌ **Sai:**
```bash
?filters={status:active}  # Missing quotes
?filters={'status':'active'}  # Single quotes không hợp lệ
```

### 2. URL Encoding

Khi gửi qua browser/API client, cần **encode JSON**:

```javascript
// JavaScript
const filters = { status: 'active' };
const encoded = encodeURIComponent(JSON.stringify(filters));
// "%7B%22status%22%3A%22active%22%7D"
```

### 3. Filters vs Search

| Feature | Filters | Search |
|---------|---------|--------|
| Match type | Exact | Partial (LIKE) |
| Multiple fields | ✅ | ✅ |
| Syntax | JSON object | Simple string |
| Use case | Exact filtering | Text search |

### 4. Performance

- ✅ Filters (exact match) nhanh hơn Search (LIKE)
- ✅ Nên index các trường dùng cho filters
- ⚠️ Tránh search text dài trên nhiều trường

### 5. Security

- ⚠️ Validate các field names trong filters
- ⚠️ Không cho phép filter các trường sensitive (password, tokens...)
- ✅ Base where (VD: organizationId) luôn được áp dụng để bảo mật

---

## 🎨 Frontend Integration

### Simple Filter UI

```html
<form>
  <!-- Status Filter -->
  <select name="status">
    <option value="">All Status</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
  
  <!-- Role Filter -->
  <select name="role">
    <option value="">All Roles</option>
    <option value="admin">Admin</option>
    <option value="user">User</option>
  </select>
  
  <!-- Search -->
  <input name="search" placeholder="Search..." />
  
  <button type="submit">Filter</button>
</form>
```

```javascript
// Build API URL
const buildApiUrl = (formData) => {
  const filters = {};
  if (formData.status) filters.status = formData.status;
  if (formData.role) filters.role = formData.role;
  
  const params = new URLSearchParams({ page: 1, limit: 10 });
  
  if (Object.keys(filters).length > 0) {
    params.append('filters', JSON.stringify(filters));
  }
  
  if (formData.search) {
    params.append('search', formData.search);
  }
  
  return `/api/users/paginated?${params}`;
};
```

---

## 📚 Tổng Kết

### Khi nào dùng gì?

| Scenario | Nên dùng |
|----------|----------|
| Lọc chính xác theo status/role/department | **filters** |
| Tìm kiếm text trong email/name | **search** |
| Tìm trong 1 trường cụ thể | **searchField + searchValue** |
| Kết hợp filter + search | **filters + search** |
| Filter nhiều điều kiện phức tạp | **filters** |

### Quick Reference

```bash
# Basic pagination
?page=1&limit=10

# Exact filter
?filters={"status":"active"}

# Text search (multi-field)
?search=john

# Text search (single field)
?searchField=email&searchValue=gmail

# Combined
?filters={"status":"active"}&search=john&page=1&limit=10&sortBy=createdAt&sortOrder=DESC
```
