import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import compression from '@fastify/compress';

async function bootstrap() {
  ConfigModule.forRoot({
    isGlobal: true,
  }); // this will load the .env file and make it available to the entire application
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger:
        process.env.ENVIRONMENT !== 'production' &&
        process.env.LOGGER === 'true',
    }),
  );
  await app.register(compression, { encodings: ['gzip', 'deflate'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // this will remove any properties that are not in the DTO
      transform: true, // this will transform the incoming data to the DTO type
      transformOptions: {
        enableImplicitConversion: true, // this will convert the data to the type specified in the DTO
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
