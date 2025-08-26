import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('Complete user management system with authentication, friend requests, and file uploads')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Authentication related endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Friend Requests', 'Friend request system endpoints')
    .addTag('Files', 'File upload and management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
