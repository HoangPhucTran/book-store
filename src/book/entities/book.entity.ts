import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn('uuid',{name: 'id'})
    id: string;

    @Column({name: 'title'})
    title: string;

    @Column({name: 'author'})
    author: string;

    @Column({name: 'price'})
    price: number;

    @Column({name: 'stock'})
    stock: number;

    @Column({name: 'create_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createDate: Date;

    @Column({name: 'update_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updateDate: Date;
}