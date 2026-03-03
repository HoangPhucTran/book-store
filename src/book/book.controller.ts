import { Controller, Get, Post, Param, Body, UseInterceptors } from '@nestjs/common';
import { BookService } from './book.service';
import { CacheInterceptor } from '@nestjs/cache-manager';


@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll() {
    console.log('Request Headers');
    return this.bookService.findAll();
  }
}
