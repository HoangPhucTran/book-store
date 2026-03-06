import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { BookModule } from './book/book.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        // `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      logging: true,
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        stores: [createKeyv('redis://localhost:6379')],
        ttl: 1000 * 60 * 60,
      }),
    }),

    UserModule,
    OrderModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly dataSource: DataSource) {
    console.log('DB connected', dataSource.isInitialized);
  }
}