import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDto } from './dtos/order.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
    constructor (
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @Inject('NATS_SERVICE') private natsClient: ClientProxy
    ) {}

    async findAll() : Promise<Order[]> {
        return await this.orderRepository.find();
    }

    async findOneById(id: string) : Promise <Order | null> {
        return await this.orderRepository.findOneBy({
            id: id
        });
    }

    async add(orderDto: OrderDto): Promise<Order> {
        try {
            console.log('orderDto =', orderDto);
            const order = this.orderRepository.create({
                userId: orderDto.userId,
                totalPrice: orderDto.totalPrice,
                orderStatus: orderDto.orderStatus
            });
            
            const saveOrder = await this.orderRepository.save(order);
            
            console.log('Send event:', orderDto);
            this.natsClient.send('order.created', orderDto).subscribe({
                complete: () => console.log('Event published: order.created'),
                error: (err) => console.log('Error publishing event:', err),
            });
            return saveOrder;
        } catch (er) {
            throw new Error('Create order failed: ' + er.message);
        }
    }

    async edit(id: string, orderDto: OrderDto): Promise<Order> {
        try {
            const order = await this.findOneById(id);

            if (!order)
                throw new NotFoundException('Order not found');

            Object.assign(order, orderDto);

            const saveOrder = await this.orderRepository.save(order);

            return saveOrder;
        } catch (er) {
            throw new Error('Edit order failed: ' + er.message);
        }
    }

    async delete(id: string) : Promise<void> {
        try {
            await this.orderRepository.delete(id);
        } catch (error) {
            throw new Error('Delete order failed: ' + error.message);
        }
    }
}
