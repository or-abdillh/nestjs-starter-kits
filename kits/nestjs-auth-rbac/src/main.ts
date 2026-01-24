import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType, ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  // Create NestJS app
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend integration
  app.enableCors();

  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS JWT OAuth Passport Starter Kit')
    .setDescription('Authentication API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
