export interface BookDto {
    id?: string;
    title: string;
    author: string;
    price: number | null;
    stock: number | null;
    updateDate?: Date;
    createDate?: Date;
}