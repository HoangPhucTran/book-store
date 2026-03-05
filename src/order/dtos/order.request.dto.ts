import { StatusType } from "../entities/order.entity";

export class OrderRequestDto {
    id?: string;
    userId: string;
    status: StatusType;
    totalPrice: number;
    item: {
        bookId: string,
        quantity: number,
        price: number,
    }[];
}