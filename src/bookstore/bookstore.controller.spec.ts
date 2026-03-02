import { Test, TestingModule } from '@nestjs/testing';
import { BookstoreController } from './bookstore.controller';

describe('BookstoreController', () => {
  let controller: BookstoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookstoreController],
    }).compile();

    controller = module.get<BookstoreController>(BookstoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
