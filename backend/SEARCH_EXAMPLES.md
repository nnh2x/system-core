# 🔍 Hướng Dẫn Sử Dụng Search API

## 1. Tìm Kiếm Chung (Multi-field Search)

Tìm kiếm trên **TẤT CẢ** các trường đã định nghĩa trong `searchFields`.

### Cú pháp:
```bash
GET /users/paginated?search=<từ_khóa>
```

### Ví dụ:

```bash
# Tìm users có email, firstName, lastName, hoặc fullName chứa "john"
GET /users/paginated?search=john

# Kết quả có thể là:
# - email: john@gmail.com
# - firstName: John
# - lastName: Johnson
# - fullName: John Doe
```

```bash
# Tìm users có thông tin chứa "@gmail.com"
GET /users/paginated?search=@gmail.com

# Kết quả: Tất cả users có email domain gmail.com
```

```bash
# Tìm users có thông tin chứa "nguyen"
GET /users/paginated?search=nguyen

# Kết quả:
# - email: nguyen@example.com
# - firstName: Nguyen
# - lastName: Nguyen
# - fullName: Nguyen Van A
```

## 2. Tìm Kiếm Theo Trường Cụ Thể (Field-specific Search) ⭐ MỚI

Tìm kiếm trên **MỘT TRƯỜNG CỤ THỂ**.

### Cú pháp:
```bash
GET /users/paginated?searchField=<tên_trường>&searchValue=<giá_trị>
```

### Ví dụ:

```bash
# Chỉ tìm trong trường email
GET /users/paginated?searchField=email&searchValue=gmail.com

# Kết quả: Chỉ tìm trong email, không tìm firstName, lastName...
```

```bash
# Chỉ tìm trong trường firstName
GET /users/paginated?searchField=firstName&searchValue=john

# Kết quả: Chỉ những users có firstName chứa "john"
```

```bash
# Chỉ tìm trong trường lastName
GET /users/paginated?searchField=lastName&searchValue=nguyen

# Kết quả: Chỉ những users có lastName chứa "nguyen"
```

## 3. Kết Hợp Search + Pagination + Sort

```bash
# Tìm "john", trang 2, 20 items/trang, sắp xếp theo ngày tạo tăng dần
GET /users/paginated?search=john&page=2&limit=20&sortBy=createdAt&sortOrder=ASC
```

```bash
# Tìm email chứa "gmail", trang 1, 10 items, sắp xếp theo email giảm dần
GET /users/paginated?searchField=email&searchValue=gmail&page=1&limit=10&sortBy=email&sortOrder=DESC
```

## 4. So Sánh 2 Cách Tìm Kiếm

| Loại Search | Ví Dụ | Tìm Trong | Kết Quả |
|-------------|-------|-----------|---------|
| **Chung** | `?search=john` | email, firstName, lastName, fullName | Tất cả users có bất kỳ trường nào chứa "john" |
| **Cụ thể** | `?searchField=email&searchValue=john` | Chỉ email | Chỉ users có email chứa "john" |

## 5. Use Cases Thực Tế

### Use Case 1: Tìm user bất kỳ
```bash
# Người dùng gõ vào search box, tìm trên mọi trường
GET /users/paginated?search=nguyen
```

### Use Case 2: Filter theo email cụ thể
```bash
# Có dropdown chọn "Tìm theo Email", sau đó nhập giá trị
GET /users/paginated?searchField=email&searchValue=@company.com
```

### Use Case 3: Advanced Filter UI
```html
<select name="searchField">
  <option value="">Tất cả trường</option>
  <option value="email">Email</option>
  <option value="firstName">Tên</option>
  <option value="lastName">Họ</option>
</select>
<input name="searchValue" placeholder="Nhập từ khóa..." />
```

## 6. Lưu Ý Quan Trọng ⚠️

1. **Không phân biệt chữ hoa/thường**: 
   - `?search=JOHN` = `?search=john` = `?search=John`

2. **Tìm kiếm partial match** (chứa):
   - `?search=john` sẽ tìm: "john", "johnson", "john123", "ajohnb"

3. **Ưu tiên**:
   - Nếu có cả `searchField` + `searchValue` VÀ `search`, hệ thống ưu tiên `searchField`

4. **Các trường có thể tìm kiếm** (trong Users):
   - `email`
   - `firstName`
   - `lastName`
   - `fullName`

## 7. Response Format

```json
{
  "data": [
    {
      "id": 1,
      "email": "john@gmail.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-02-27T00:00:00Z",
      "status": "active"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

## 8. Testing với cURL

```bash
# Test search chung
curl "http://localhost:3000/users/paginated?search=john" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test search theo trường cụ thể
curl "http://localhost:3000/users/paginated?searchField=email&searchValue=gmail" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test với full parameters
curl "http://localhost:3000/users/paginated?page=1&limit=10&search=john&sortBy=email&sortOrder=ASC" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
