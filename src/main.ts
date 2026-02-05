import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerCustomService } from './logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerCustomService(), // Provide an instance of your custom logger
  });
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('System Core API')
    .setDescription('The System Core API description')
    .setVersion('1.0')
    .addTag('system-core')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on port: ${await app.getUrl()}`);
}
bootstrap();
