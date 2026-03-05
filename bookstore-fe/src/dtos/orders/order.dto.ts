import type { UserDto } from "../users/user.dto";

export type StatusType = 'PENDING' | 'PAID' | 'CANCELLED';

export interface OrderDto {
    id?: string;
    userId: string;
    user?: UserDto;
    totalPrice: number | null;
    status: StatusType;
}

export interface OrderRequestDto {
    id?: string;
    userId: string;
    status: StatusType;
    totalPrice: number | null;
    item: {
        bookId: string,
        quantity: number | null,
        price: number | null
    }[];
}

export interface OrderDetailsResponseDto {
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