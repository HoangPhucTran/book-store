import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { NatsClientModule } from '../nats-client/nats-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]),
  NatsClientModule,
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
