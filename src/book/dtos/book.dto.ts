import { IsNumber, IsString } from "class-validator";

export class BookDto {
    @IsString()
    id?: string;

    @IsString()
    title: string;

    @IsString()
    author: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;
}