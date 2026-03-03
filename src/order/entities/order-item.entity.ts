import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Book } from "../../book/entities/book.entity";

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid',{name: 'id'})
    id: string;

    @Column({name: 'order_id', type: 'uuid'})
    orderId: string;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
    order: Order;

    @Column({name: 'book_id', type: 'uuid'})
    bookId: string;

    @ManyToOne(() => Book)
    @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
    book: Book;

    @Column({name: 'price'})
    price: number;
}