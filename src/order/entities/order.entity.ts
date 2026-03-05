import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum StatusType {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED'
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid',{name: 'id'})
    id: string;

    @Column({name: 'users_id', type: 'uuid'})
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'users_id', referencedColumnName: 'id' })
    user: User;

    @Column({name: 'total_price', type: 'decimal', precision: 12, scale: 2})
    totalPrice: number;

    @Column({
        name: 'order_status', 
        type: 'enum',
        enum: StatusType,
        default: StatusType.PENDING
    })
    orderStatus: StatusType;

    @Column({name: 'create_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createDate: Date;

    @Column({name: 'update_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updateDate: Date;
}