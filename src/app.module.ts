import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { BookModule } from './book/book.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      logging: true,
      
    }),

    UserModule,
    OrderModule,
    BookModule,
  ],
  controllers: [AppController, UserController],
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ]
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        stores: [createKeyv('redis://localhost:6379')],
        ttl: 1000 * 60 * 60,
      }),
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly dataSource: DataSource) {
    console.log('DB connected', dataSource.isInitialized);
  }
}