import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Số trang (bắt đầu từ 1)',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang phải lớn hơn hoặc bằng 1' })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi mỗi trang',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Type(() => Number)
  @IsInt({ message: 'Kích thước trang phải là số nguyên' })
  @Min(1, { message: 'Kích thước trang phải lớn hơn hoặc bằng 1' })
  @Max(100, { message: 'Kích thước trang không được vượt quá 100' })
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm (tìm trên tất cả các trường đã định nghĩa)',
    example: 'john',
  })
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo trường cụ thể (VD: email=john@gmail.com)',
    example: 'email',
  })
  @IsString({ message: 'Tên trường tìm kiếm phải là chuỗi' })
  @IsOptional()
  searchField?: string;

  @ApiPropertyOptional({
    description: 'Giá trị tìm kiếm cho trường cụ thể',
    example: 'john@gmail.com',
  })
  @IsString({ message: 'Giá trị tìm kiếm phải là chuỗi' })
  @IsOptional()
  searchValue?: string;

  @ApiPropertyOptional({
    description: 'Filters động (JSON string). VD: {"email":"john@gmail.com","status":"active"}',
    example: '{"status":"active"}',
  })
  @IsString({ message: 'Filters phải là chuỗi JSON' })
  @IsOptional()
  filters?: string;

  @ApiPropertyOptional({
    description: 'Trường để sắp xếp',
    example: 'createdAt',
  })
  @IsString({ message: 'Trường sắp xếp phải là chuỗi' })
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsEnum(SortOrder, { message: 'Thứ tự sắp xếp phải là ASC hoặc DESC' })
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;
}

export class PaginationMetaDto {
  @ApiProperty({ description: 'Trang hiện tại' })
  page: number;

  @ApiProperty({ description: 'Số lượng bản ghi mỗi trang' })
  limit: number;

  @ApiProperty({ description: 'Tổng số bản ghi' })
  totalItems: number;

  @ApiProperty({ description: 'Tổng số trang' })
  totalPages: number;

  @ApiProperty({ description: 'Có trang trước không' })
  hasPreviousPage: boolean;

  @ApiProperty({ description: 'Có trang sau không' })
  hasNextPage: boolean;
}

export class PaginationResponseDto<T> {
  @ApiProperty({ description: 'Dữ liệu' })
  data: T[];

  @ApiProperty({ description: 'Thông tin phân trang', type: PaginationMetaDto })
  meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
