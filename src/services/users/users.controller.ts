import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dtos/user.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  public async users(): Promise<any> {
    return this.usersService.users();
  }

  @Get('orders')
  public async orders(): Promise<any> {
    return this.usersService.userOrders();
  }

  @Post('')
  @ApiOperation({ summary: 'Tạo user mới' })
  @ApiBody({ type: CreateUserDto })
  public async createUser(@Body() userData: Partial<CreateUserDto>): Promise<string> {
    return this.usersService.createUser(userData);
  }
}
