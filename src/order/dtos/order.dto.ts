import { IsEnum, IsNumber, IsString } from 'class-validator';
import { StatusType } from '../entities/order.entity';

export class OrderDto {
  @IsString()
  id?: string;

  @IsString()
  userId: string;

  @IsNumber()
  totalPrice: number;

  @IsEnum(StatusType)
  orderStatus: StatusType;
}
