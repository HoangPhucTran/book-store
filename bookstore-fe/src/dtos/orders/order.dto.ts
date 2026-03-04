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
    bookId: string[];
    quantity: number | null;
    status: StatusType;
}
