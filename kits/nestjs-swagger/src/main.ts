import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Enable versioning using URI
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Swagger')
    .setDescription('NestJS Swagger API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token'
    ) // Add bearer auth
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger
  SwaggerModule.setup('docs', app, document); // http://localhost:3000/docs

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
