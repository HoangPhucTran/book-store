import type { BookDto } from "../books/book.dto";
import type { OrderDto } from "./order.dto";

export interface OrderItemDto {
    id?: string;
    bookId: string;
    book?: BookDto;
    orderId: string;
    order?: OrderDto;
    quatity: number | null;
    price: number | null;
}