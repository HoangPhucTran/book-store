import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderDto } from './dtos/order.dto';

@Controller('orders')
export class OrderController {
    constructor (
        private readonly orderService: OrderService
    ) {}

    @Get()
    async getOrders() : Promise <Order[]> {
        return this.orderService.findAll();
    }

    @Get(':id')
    async getOrderById(@Param('id') id: string) : Promise<Order | null> {
        return this.orderService.findOneById(id);
    }

    @Put(':id')
    async editOrder(@Param('id') id: string, @Body() dto: OrderDto) : Promise<any> {
        return this.orderService.edit(id, dto);
    }

    @Post()
    async addOrder(@Body() dto: OrderDto) : Promise<Order> {
        return this.orderService.add(dto);
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id: string) : Promise <void> {
        return this.orderService.delete(id);
    }
}
