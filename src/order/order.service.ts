import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, StatusType } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDto } from './dtos/order.dto';
import { ClientProxy } from '@nestjs/microservices';

import { OrderEditRequestDto, OrderRequestDto } from './dtos/order.request.dto';
import { User } from 'src/user/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';
import { OrderItem } from './entities/order-item.entity';
import { BookDto } from 'src/book/dtos/book.dto';
import { OrderListResponseDto } from './dtos/orderList.response.dto';
import { OrderDetailsResponseDto } from './dtos/orderDetails.response.dto';
import { title } from 'process';

@Injectable()
export class OrderService {
    constructor (
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @Inject('NATS_SERVICE') private natsClient: ClientProxy,

        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) {}

    async findAll() : Promise<OrderListResponseDto[]> {
        const orderList = await this.orderRepository.find();
        let orderListRes: OrderListResponseDto[] = [];
        for (const i of orderList) {
            const user = await this.userRepository.findOneBy({
                id: i.userId
            });
            
            orderListRes.push({
                id: i.id,
                userName: user?.name,
                status: i.orderStatus,
                totalPrice: i.totalPrice,
                createDate: i.createDate
            });
        }

        return orderListRes;
    }

    async findOneById(id: string) : Promise <OrderDetailsResponseDto> {
        try {
            const order = await this.orderRepository.findOne({
                where: { id },
                relations: ['user'],
            });

            if (!order)
                throw new NotFoundException('Order not found');

            const orderItems = await this.orderItemRepository.find({
                where: { orderId: order.id },
                relations: ['book'],
            });

            const orderDetails: OrderDetailsResponseDto = {
                id: order.id,
                userId: order.userId,
                name: order.user.name,
                status: order.orderStatus,
                totalPrice: order.totalPrice,
                item: orderItems.map(i => {
                    return {
                        bookId: i.bookId,
                        title: i.book.title,
                        quantity: i.quantity,
                        stock: i.book.stock,
                        price: i.price
                    }
                })
            };

            return orderDetails;
        } catch (er) {
            throw new Error('Edit order failed: ' + er.message);
        }
       
    }

    async add(orderDto: OrderRequestDto): Promise<Order> {
        try {
            console.log('orderDto =', orderDto);
            const order = this.orderRepository.create({
                userId: orderDto.userId,
                totalPrice: orderDto.totalPrice,
                orderStatus: orderDto.status
            });
            const saveOrder = await this.orderRepository.save(order);

            const orderItems = orderDto.item.map(i =>
                this.orderItemRepository.create({
                    orderId: saveOrder.id,
                    bookId: i.bookId,
                    quantity: i.quantity,
                    price: i.price
                })
            );

            await this.orderItemRepository.save(orderItems);

            for (const i of orderDto.item) {
                const book = await this.bookRepository.findOne({
                    where: { id: i.bookId }
                });

                if (!book) throw new Error("Book not found");

                await this.bookRepository.update(
                    { id: i.bookId },
                    { stock: book.stock - i.quantity }
                );
            }

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

    async edit(id: string, orderDto: OrderEditRequestDto): Promise<Order> {
        try {
            const order = await this.orderRepository.findOne({
                where: { id },
            });

            if (!order)
                throw new NotFoundException('Order not found');

            order.orderStatus = orderDto.status;
            order.totalPrice = orderDto.totalPrice;

            await this.orderRepository.save(order);

            const orderItems = await this.orderItemRepository.find({
                where: { orderId: order.id },
            });

            if (!orderItems)
                throw new NotFoundException('Order Item not found');

            for (const dtoItem of orderDto.item) {

                const book = await this.bookRepository.findOne({
                    where: { id: dtoItem.bookId }
                });

                if (!book) throw new Error("Book not found");

                const orderItem = orderItems.find(
                    (i) => i.bookId === dtoItem.bookId
                );

                if (!orderItem) throw new Error("Book not found");

                await this.bookRepository.update(
                    { id: dtoItem.bookId },
                    { stock: book.stock - (dtoItem.quantity - orderItem.quantity) }
                );

                if (orderItem) {
                    orderItem.quantity = dtoItem.quantity;

                    await this.orderItemRepository.save(orderItem);
                }
            }

            return order;
        } catch (er) {
            throw new Error('Edit order failed: ' + er.message);
        }
    }

    async delete(id: string) : Promise<void> {
        try {
            const orderItems = await this.orderItemRepository.find({
                where: { orderId: id },
            });

            if (!orderItems)
                throw new NotFoundException('Order Item not found');

            for (const dtoItem of orderItems) {
                await this.orderItemRepository.delete({
                    id: dtoItem.id
                });
            }
            
            await this.orderRepository.delete(id);
        } catch (error) {
            throw new Error('Delete order failed: ' + error.message);
        }
    }
}
