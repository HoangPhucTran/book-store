import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { BookDto } from './dtos/book.dto';
import { UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('books')
  @Get()
  async getBooks(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<Book | null> {
    return this.bookService.findOneById(id);
  }

  @Put(':id')
  async editBook(@Param('id') id: string, @Body() dto: BookDto): Promise<any> {
    return this.bookService.edit(id, dto);
  }

  @Post()
  async addBook(@Body() dto: BookDto): Promise<Book> {
    return this.bookService.add(dto);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<void> {
    return this.bookService.delete(id);
  }
}
