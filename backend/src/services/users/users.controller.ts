import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserDto } from 'src/dtos/user.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserProfile } from 'src/interfaces/auth.interface';
import { PaginationQueryDto, PaginationResponseDto } from 'src/dtos/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async users(
    @CurrentUser() currentUser: UserProfile,
  ): Promise<UserDto[]> {
    return this.usersService.users(currentUser);
  }

  @Get('paginated')
  public async getUsersPaginated(
    @CurrentUser() currentUser: UserProfile,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginationResponseDto<UserDto>> {
    return this.usersService.getUsersPaginated(currentUser, query);
  }

  @Get('orders')
  public async orders(): Promise<any> {
    return this.usersService.userOrders();
  }

  @Post('')
  @ApiOperation({ summary: 'Tạo user mới' })
  @ApiBody({ type: CreateUserDto })
  public async createUser(
    @Body() userData: Partial<CreateUserDto>,
    @CurrentUser() currentUser: any,
  ): Promise<string> {
    return this.usersService.createUser(userData, currentUser);
  }
}
