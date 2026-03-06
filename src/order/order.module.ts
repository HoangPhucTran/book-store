import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UserModule } from 'src/user/user.module';
import { BookModule } from 'src/book/book.module';
import { NatsClientModule } from '../nats-client/nats-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UserModule,
    BookModule,
    NatsClientModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
