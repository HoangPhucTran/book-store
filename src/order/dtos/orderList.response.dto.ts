import { StatusType } from '../entities/order.entity';

export class OrderListResponseDto {
  id?: string;
  userName?: string;
  status: StatusType;
  totalPrice: number;
  createDate: Date;
}
