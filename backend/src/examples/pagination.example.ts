/**
 * VÍ DỤ SỬ DỤNG PAGINATION
 * 
 * File này chứa các ví dụ về cách sử dụng hệ thống phân trang
 */

import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationQueryDto, PaginationResponseDto } from '../dtos/pagination.dto';
import { paginate } from '../utils/pagination.util';
import { Repository } from 'typeorm';

/**
 * VÍ DỤ 1: Sử dụng trong Controller
 * 
 * @Controller('users')
 * export class UsersController {
 *   constructor(private readonly usersService: UsersService) {}
 * 
 *   @Get()
 *   @ApiOperation({ summary: 'Lấy danh sách users với phân trang' })
 *   @ApiResponse({ 
 *     status: 200, 
 *     description: 'Danh sách users',
 *     type: PaginationResponseDto
 *   })
 *   async getUsers(@Query() query: PaginationQueryDto) {
 *     return this.usersService.getUsersPaginated(query);
 *   }
 * }
 */

/**
 * VÍ DỤ 2: Sử dụng trong Service đơn giản
 * 
 * async findAllProducts(query: PaginationQueryDto) {
 *   return paginate({
 *     repository: this.productRepository,
 *     query,
 *     searchFields: ['name', 'description', 'sku'],
 *     where: { isActive: true },
 *     relations: { category: true, images: true },
 *   });
 * }
 */

/**
 * VÍ DỤ 3: Phân trang với điều kiện where phức tạp
 * 
 * async findProductsByCategory(
 *   categoryId: string,
 *   query: PaginationQueryDto
 * ) {
 *   return paginate({
 *     repository: this.productRepository,
 *     query,
 *     searchFields: ['name', 'description'],
 *     where: { 
 *       categoryId,
 *       isActive: true,
 *       stock: MoreThan(0)
 *     },
 *     relations: { category: true },
 *     select: ['id', 'name', 'price', 'stock'],
 *   });
 * }
 */

/**
 * VÍ DỤ 4: Phân trang với multiple relations
 * 
 * async findOrders(query: PaginationQueryDto, userId: string) {
 *   return paginate({
 *     repository: this.orderRepository,
 *     query,
 *     searchFields: ['orderNumber', 'customerName'],
 *     where: { userId },
 *     relations: {
 *       items: true,
 *       customer: true,
 *       payment: true,
 *     },
 *   });
 * }
 */

/**
 * VÍ DỤ 5: Sử dụng với buildWhereCondition
 * 
 * import { buildWhereCondition } from 'src/utils/pagination.util';
 * 
 * async findWithDynamicFilters(
 *   query: PaginationQueryDto,
 *   filters: { status?: string; minPrice?: number }
 * ) {
 *   const whereCondition = buildWhereCondition(
 *     { isActive: true },
 *     filters.status ? { status: filters.status } : {},
 *   );
 * 
 *   return paginate({
 *     repository: this.productRepository,
 *     query,
 *     searchFields: ['name'],
 *     where: whereCondition,
 *   });
 * }
 */

/**
 * CÁCH GỌI API:
 * 
 * 1. Phân trang cơ bản:
 *    GET /api/users?page=1&limit=10
 * 
 * 2. Phân trang với tìm kiếm:
 *    GET /api/users?page=1&limit=10&search=john
 * 
 * 3. Phân trang với sắp xếp:
 *    GET /api/users?page=1&limit=10&sortBy=createdAt&sortOrder=DESC
 * 
 * 4. Kết hợp tất cả:
 *    GET /api/users?page=2&limit=20&search=john&sortBy=email&sortOrder=ASC
 */

/**
 * RESPONSE FORMAT:
 * 
 * {
 *   "data": [
 *     { "id": 1, "name": "User 1", ... },
 *     { "id": 2, "name": "User 2", ... },
 *   ],
 *   "meta": {
 *     "page": 1,
 *     "limit": 10,
 *     "totalItems": 100,
 *     "totalPages": 10,
 *     "hasPreviousPage": false,
 *     "hasNextPage": true
 *   }
 * }
 */
