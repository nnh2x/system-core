import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async users(): Promise<any> {
    return this.usersService.users();
  }

  @Get('orders')
  public async orders(): Promise<any> {
    return this.usersService.userOrders();
  }
}
