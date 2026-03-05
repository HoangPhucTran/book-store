import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderDto } from './dtos/order.dto';
import { OrderRequestDto } from './dtos/order.request.dto';
import { OrderListResponseDto } from './dtos/orderList.response.dto';
import { OrderDetailsResponseDto } from './dtos/orderDetails.response.dto';

@Controller('orders')
export class OrderController {
    constructor (
        private readonly orderService: OrderService
    ) {}

    @Get()
    async getOrders() : Promise <OrderListResponseDto[]> {
        return this.orderService.findAll();
    }

    @Get(':id')
    async getOrderById(@Param('id') id: string) : Promise<OrderDetailsResponseDto> {
        return this.orderService.findOneById(id);
    }

    @Put(':id')
    async editOrder(@Param('id') id: string, @Body() dto: OrderRequestDto) : Promise<any> {
        return this.orderService.edit(id, dto);
    }

    @Post()
    async addOrder(@Body() dto: OrderRequestDto) : Promise<Order> {
        return this.orderService.add(dto);
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id: string) : Promise <void> {
        return this.orderService.delete(id);
    }
}
