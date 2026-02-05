import { Injectable, Scope } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(private readonly orderService: OrdersService) {}

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
}
