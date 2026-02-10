import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerCustomService } from './logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerCustomService(), // Provide an instance of your custom logger
  });

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('IAM & License Management System API')
    .setDescription(
      'Identity & Access Management + License/Entitlement Service',
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('rbac')
    .addTag('organizations')
    .addTag('license')
    .addTag('entitlement')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on port: ${await app.getUrl()}`);
}
bootstrap();
