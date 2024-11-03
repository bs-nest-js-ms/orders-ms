import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Orders Microservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: envs.nats_servers,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
    })
  );

  await app.listen();
  logger.log(`===> Orders Microservice Started on port: ${envs.port} <===`);
}
bootstrap();
