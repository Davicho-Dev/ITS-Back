import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const configService = app.get(ConfigService);

  const kafkaConfig = configService.get<MicroserviceOptions>('kafka')!;
  app.connectMicroservice<MicroserviceOptions>(kafkaConfig);

  await app.startAllMicroservices();

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`Users Microservice is running on: http://localhost:${port}`);
  console.log(`Kafka Consumer is connected`);
}
bootstrap();
