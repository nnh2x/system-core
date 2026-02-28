import {
    Repository,
    FindManyOptions,
    FindOptionsWhere,
    FindOptionsRelations,
    ILike,
} from 'typeorm';
import {
    PaginationQueryDto,
    PaginationMetaDto,
    PaginationResponseDto,
} from '../dtos/pagination.dto';
import { json } from 'stream/consumers';

export interface PaginationOptions<T> {
    repository: Repository<T>;
    query: PaginationQueryDto;
    searchFields?: (keyof T)[];
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    relations?: FindOptionsRelations<T>;
    select?: (keyof T)[];
}

/**
 * Hàm phân trang chung cho tất cả các entity
 * @param options - Các tùy chọn phân trang
 * @returns PaginationResponseDto chứa dữ liệu và metadata
 */
export async function paginate<T>(
    options: PaginationOptions<T>,
): Promise<PaginationResponseDto<T>> {
    const {
        repository,
        query,
        searchFields = [],
        where = {},
        relations,
        select,
    } = options;

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện where
    let whereConditions: FindOptionsWhere<T> | FindOptionsWhere<T>[] = where;

    // Parse dynamic filters nếu có
    let parsedFilters: any = {};
    if (query.filters) {
        try {
            parsedFilters = JSON.parse(query.filters);

            console.log('parsedFilters', parsedFilters);
        } catch {
            // Nếu parse lỗi, bỏ qua filters
            console.warn('Invalid filters JSON:', query.filters);
        }
    }

    // Xử lý tìm kiếm theo trường cụ thể (ưu tiên cao nhất)
    if (query.searchField && query.searchValue) {
        const condition = { ...(where as any), ...parsedFilters };
        condition[query.searchField] = ILike(`%${query.searchValue}%`);
        whereConditions = condition;
    }
    // Xử lý tìm kiếm chung trên nhiều trường
    else if (parsedFilters.length > 0) {
        const keywords = query.search.trim().split(/\s+/);

        // mỗi keyword sẽ tạo 1 nhóm OR
        const andConditions: FindOptionsWhere<T>[] = [];

        keywords.forEach((word) => {
            const orConditions = searchFields.map((field) => {
                return {
                    ...(where as any),
                    ...parsedFilters,
                    [field]: ILike(`%${word}%`),
                };
            });

            andConditions.push(orConditions as any);
        });

        console.log('andConditions',JSON.stringify(andConditions, null, 2));

        whereConditions = andConditions as any;
    }
    // Chỉ có filters động
    else if (Object.keys(parsedFilters).length > 0) {
        whereConditions = { ...(where as any), ...parsedFilters };
    }

    // Xây dựng options cho TypeORM
    const findOptions: FindManyOptions<T> = {
        where: whereConditions,
        skip,
        take: limit,
    };

    // Thêm relations nếu có
    if (relations) {
        findOptions.relations = relations;
    }

    // Thêm select nếu có
    if (select && select.length > 0) {
        findOptions.select = select as any;
    }

    // Thêm sắp xếp nếu có
    if (query.sortBy) {
        findOptions.order = {
            [query.sortBy]: query.sortOrder || 'DESC',
        } as any;
    }

    // Thực hiện query
    const [data, totalItems] = await repository.findAndCount(findOptions);

    // Tính toán metadata
    const totalPages = Math.ceil(totalItems / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    const meta: PaginationMetaDto = {
        page,
        limit,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
    };

    return new PaginationResponseDto(data, meta);
}

/**
 * Hàm helper để tạo điều kiện where linh hoạt
 */
export function buildWhereCondition<T>(
    baseWhere: FindOptionsWhere<T>,
    additionalConditions?: Partial<T>,
): FindOptionsWhere<T> {
    return {
        ...baseWhere,
        ...additionalConditions,
    } as FindOptionsWhere<T>;
}
