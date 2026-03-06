import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Book store')
    .setDescription('The book store API description')
    .setVersion('1.0')
    .addTag('books')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const redis = new Redis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: 1,
  });

  redis.on('error', () => {});

  try {
    await redis.flushall();
    console.log('Redis cache is cleared');
  } catch (err) {
    console.log('Redis server not avaiable, skip flush');
  }

  console.log('PORT FROM CONFIG =', process.env.PORT);

  // await app.listen(process.env.PORT || 3123 );
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
