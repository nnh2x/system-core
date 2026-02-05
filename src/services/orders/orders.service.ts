import { BadRequestException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class OrdersService extends Logger {
  private readonly logger = new Logger(AppService.name);

  public async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async orders(): Promise<any> {
    for (let i = 0; i < 5; i++) {
      this.logger.log(`Processing order ${i + 1}`);
      await this.sleep(500);
    }

    const randomError = Math.random() < 0.5;
    if (randomError) {
      throw new BadRequestException('This is a bad request example');
    } else {
      return [
        { id: 1, item: 'Laptop', quantity: 1 },
        { id: 2, item: 'Phone', quantity: 2 },
      ];
    }
  }
}
