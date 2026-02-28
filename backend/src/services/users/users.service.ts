import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { UsersEntity } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto, UserDto } from 'src/dtos/user.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserProfile } from 'src/interfaces/auth.interface';
import { Repository } from 'typeorm';
import {
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/dtos/pagination.dto';
import { paginate } from 'src/utils/pagination.util';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(
    private readonly orderService: OrdersService,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  public async users(
    @CurrentUser() currentUser: UserProfile,
  ): Promise<UserDto[]> {
    const users = await this.usersRepository.find({
      relations: {
        organization: true,
      },
      where: { organizationId: currentUser.organizationId },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'organization',
        'fullName',
        'createdAt',
        'updatedAt',
        'status'
      ],
    });
    return users;
  }

  /**
   * Lấy danh sách users với phân trang và tìm kiếm
   */
  public async getUsersPaginated(
    @CurrentUser() currentUser: UserProfile,
    query: PaginationQueryDto,
  ): Promise<PaginationResponseDto<UsersEntity>> {
    return paginate<UsersEntity>({
      repository: this.usersRepository,
      query,
      searchFields: ['email', 'firstName', 'lastName', 'fullName'],
      where: { organizationId: currentUser.organizationId },
      relations: { organization: true },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'fullName',
        'createdAt',
        'updatedAt',
        'status',
      ],
    });
  }

  public async userOrders(): Promise<any> {
    return await this.orderService.orders();
  }

  public async createUser(
    userData: Partial<CreateUserDto>,
    @CurrentUser() currentUser: UserProfile,
  ): Promise<string> {
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: userData.email,
        organizationId: currentUser.organizationId,
      },
    });
    if (existingUser) {
      throw new BadRequestException(
        `User with this email ${userData.email} already exists in the organization`,
      );
    }

    const newUser = this.usersRepository.create({
      ...userData,
      organizationId: currentUser.organizationId,
    });
    await this.usersRepository.save(newUser);
    return 'User created successfully';
  }
}
