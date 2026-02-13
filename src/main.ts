import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('LMS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .setBasePath('/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const server = app.getHttpAdapter().getInstance();
  server.set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'DELETE', 'GET', 'PATCH'],
    credentials: true,
  });
  await app.listen(4000, '0.0.0.0');
}
bootstrap();
