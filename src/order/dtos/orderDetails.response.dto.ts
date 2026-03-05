import { StatusType } from "../entities/order.entity";

export class OrderDetailsResponseDto {
    id?: string;
    userId: string;
    name: string;
    status: StatusType;
    totalPrice: number;
    item: {
        bookId: string,
        title: string,
        quantity: number,
        price: number,
        stock: number,
    }[];
}