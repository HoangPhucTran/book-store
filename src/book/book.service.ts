import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { BookDto } from './dtos/book.dto';

@Injectable()
export class BookService {
    constructor (
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) {}

    async findAll() : Promise<Book[]> {
        return await this.bookRepository.find();
    }

    async findOneById(id: string) : Promise <Book | null> {
        return await this.bookRepository.findOneBy({
            id: id
        });
    }

    async add(bookDto: BookDto): Promise<Book> {
        try {
            const book = this.bookRepository.create({
                title: bookDto.title,
                author: bookDto.author,
                price: bookDto.price,
                stock: bookDto.stock
            });

            const saveBook = await this.bookRepository.save(book);

            return saveBook;
        } catch (er) {
            throw new Error('Create book failed: ' + er.message);
        }
    }

    async edit(id: string, bookDto: BookDto): Promise<Book> {
        try {
            const book = await this.findOneById(id);

            if (!book)
                throw new NotFoundException('Book not found');

            book.author = bookDto.author;
            book.title = bookDto.title;
            book.price = bookDto.price;
            book.stock = bookDto.stock;

            const saveBook = await this.bookRepository.save(book);
            return saveBook;
        } catch (er) {
            throw new Error('Edit book failed: ' + er.message);
        }
    }

    async delete(id: string) : Promise<void> {
        try {
            await this.bookRepository.delete(id);
        } catch (error) {
            throw new Error('Delete book failed: ' + error.message);
        }
    }
}
