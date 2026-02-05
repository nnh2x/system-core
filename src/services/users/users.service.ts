import { Injectable, Scope } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { UsersEntity } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dtos/user.dto';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(
    private readonly orderService: OrdersService,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  public async users(): Promise<any> {
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ];
    return users;
  }

  public async userOrders(): Promise<any> {
    return await this.orderService.orders();
  }

  public async createUser(userData: Partial<CreateUserDto>): Promise<string> {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return 'User created successfully';
  }
}
