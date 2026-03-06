import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderDto } from './dtos/order.dto';
import { OrderEditRequestDto, OrderRequestDto } from './dtos/order.request.dto';
import { OrderListResponseDto } from './dtos/orderList.response.dto';
import { OrderDetailsResponseDto } from './dtos/orderDetails.response.dto';
import { UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('orders')
  @Get()
  async getOrders(): Promise<OrderListResponseDto[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  async getOrderById(
    @Param('id') id: string,
  ): Promise<OrderDetailsResponseDto> {
    return this.orderService.findOneById(id);
  }

  @Patch(':id')
  async editOrder(
    @Param('id') id: string,
    @Body() dto: OrderEditRequestDto,
  ): Promise<any> {
    return this.orderService.edit(id, dto);
  }

  @Post()
  async addOrder(@Body() dto: OrderRequestDto): Promise<Order> {
    return this.orderService.add(dto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.delete(id);
  }
}
