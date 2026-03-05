import { Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dtos/order.dto';
import { StatusType } from './entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../auth/guards/auth.guard';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @UseGuards(AuthenticationGuard)
    @Post()
    async createOrder() {
        console.log('Creating order...');
        const orderDto: OrderDto = {
            userId:"019cb71e-924a-72f3-a232-7de868b22f6b", // for testing
            totalPrice: 100,
            orderStatus: StatusType.PENDING
        };

        return this.orderService.add(orderDto);
    }
}
