import { Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dtos/order.dto';
import { StatusType } from './entities/order.entity';
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    async createOrder() {
        console.log('Creating order...');
        const orderDto: OrderDto = {
            userId: 'user123',
            totalPrice: 100,
            orderStatus: StatusType.PENDING
        };

        return this.orderService.add(orderDto);
    }
}
