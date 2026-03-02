# Hệ Thống Phân Trang (Pagination System)

Hệ thống phân trang tái sử dụng cho NestJS với TypeORM, hỗ trợ tìm kiếm, sắp xếp và lọc dữ liệu.

## 📁 Cấu Trúc File

```
backend/src/
├── dtos/
│   └── pagination.dto.ts          # DTOs cho phân trang
├── utils/
│   └── pagination.util.ts         # Hàm tiện ích phân trang
└── examples/
    └── pagination.example.ts      # Ví dụ sử dụng
```

## 🚀 Tính Năng

- ✅ Phân trang linh hoạt cho mọi entity
- ✅ Tìm kiếm đa trường (multiple fields)
- ✅ Sắp xếp theo bất kỳ trường nào
- ✅ Hỗ trợ relations
- ✅ Hỗ trợ select fields
- ✅ Type-safe với TypeScript
- ✅ Validation tích hợp
- ✅ Swagger documentation

## 📝 Cách Sử Dụng

### 1. Import các dependencies

```typescript
import { PaginationQueryDto, PaginationResponseDto } from 'src/dtos/pagination.dto';
import { paginate } from 'src/utils/pagination.util';
```

### 2. Trong Service

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async getUsersPaginated(
    query: PaginationQueryDto,
    currentUser: UserProfile,
  ): Promise<PaginationResponseDto<UsersEntity>> {
    return paginate<UsersEntity>({
      repository: this.usersRepository,
      query,
      searchFields: ['email', 'firstName', 'lastName', 'fullName'], // Các trường để tìm kiếm
      where: { organizationId: currentUser.organizationId },         // Điều kiện lọc
      relations: { organization: true },                             // Relations cần load
      select: ['id', 'email', 'firstName', 'lastName'],             // Chỉ select các trường này
    });
  }
}
```

### 3. Trong Controller

```typescript
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách users với phân trang' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách users',
    type: PaginationResponseDto
  })
  async getUsers(
    @Query() query: PaginationQueryDto,
    @CurrentUser() currentUser: UserProfile
  ) {
    return this.usersService.getUsersPaginated(query, currentUser);
  }
}
```

## 🌐 Cách Gọi API

### Phân trang cơ bản
```bash
GET /api/users?page=1&limit=10
```

### Với tìm kiếm
```bash
GET /api/users?page=1&limit=10&search=john
```

### Với sắp xếp
```bash
GET /api/users?page=1&limit=10&sortBy=createdAt&sortOrder=DESC
```

### Kết hợp tất cả
```bash
GET /api/users?page=2&limit=20&search=john&sortBy=email&sortOrder=ASC
```

## 📊 Response Format

```json
{
  "data": [
    {
      "id": 1,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    {
      "id": 2,
      "email": "jane@example.com",
      "firstName": "Jane",
      "lastName": "Smith"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 100,
    "totalPages": 10,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

## 🎯 Ví Dụ Nâng Cao

### Phân trang với điều kiện phức tạp

```typescript
import { MoreThan } from 'typeorm';

async findActiveProducts(query: PaginationQueryDto) {
  return paginate({
    repository: this.productRepository,
    query,
    searchFields: ['name', 'description', 'sku'],
    where: { 
      isActive: true,
      stock: MoreThan(0),
      price: MoreThan(0)
    },
    relations: { 
      category: true, 
      images: true,
      reviews: true
    },
  });
}
```

### Sử dụng buildWhereCondition

```typescript
import { buildWhereCondition } from 'src/utils/pagination.util';

async findWithFilters(
  query: PaginationQueryDto,
  filters: { status?: string; categoryId?: string }
) {
  let where = buildWhereCondition(
    { isActive: true },
    filters
  );

  return paginate({
    repository: this.productRepository,
    query,
    searchFields: ['name', 'description'],
    where,
  });
}
```

## 📋 Parameters

### PaginationQueryDto

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Số trang (bắt đầu từ 1) |
| `limit` | number | No | 10 | Số lượng items mỗi trang (max: 100) |
| `search` | string | No | - | Từ khóa tìm kiếm |
| `sortBy` | string | No | createdAt | Trường để sắp xếp |
| `sortOrder` | ASC/DESC | No | DESC | Thứ tự sắp xếp |

### PaginationOptions

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `repository` | Repository<T> | Yes | TypeORM repository |
| `query` | PaginationQueryDto | Yes | Query parameters |
| `searchFields` | (keyof T)[] | No | Các trường để tìm kiếm |
| `where` | FindOptionsWhere<T> | No | Điều kiện lọc |
| `relations` | string[] \| object | No | Relations cần load |
| `select` | (keyof T)[] | No | Các trường cần select |

## 💡 Tips

1. **Giới hạn số lượng relations**: Chỉ load những relations thực sự cần thiết để tối ưu performance.

2. **Sử dụng select**: Chỉ select những fields cần thiết thay vì load toàn bộ entity.

3. **Index database**: Đảm bảo các trường dùng để search và sort đã được index.

4. **Validation**: Các DTO đã có validation sẵn, không cần thêm validation trong controller.

5. **Type Safety**: Sử dụng generic type để đảm bảo type safety:
   ```typescript
   PaginationResponseDto<UsersEntity>
   paginate<UsersEntity>({...})
   ```

## 🔒 Bảo Mật

- Pagination tự động giới hạn `limit` tối đa là 100 items/page
- Page phải >= 1
- Tất cả inputs đều được validate bằng class-validator

## 🚦 Migration và Testing

Bạn có thể test pagination system ngay bằng cách:

1. Chạy ứng dụng: `npm run start:dev`
2. Truy cập Swagger docs: `http://localhost:3000/api`
3. Test endpoint có sử dụng pagination

## 📚 Tài Liệu Tham Khảo

- [TypeORM Documentation](https://typeorm.io/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Class Validator](https://github.com/typestack/class-validator)
